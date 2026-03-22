import os
import sys
import tempfile
import unittest
from datetime import date

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

import algorithms
import db

try:
    import app as app_module
except ModuleNotFoundError:
    app_module = None


class DatabaseLogicTests(unittest.TestCase):
    def setUp(self):
        self.original_db_path = db.DB_PATH
        self.original_schema_path = db.SCHEMA_PATH
        self.temp_dir = tempfile.TemporaryDirectory()
        db.DB_PATH = os.path.join(self.temp_dir.name, 'test.db')
        db.SCHEMA_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'schema.sql')
        db.init_db()

    def tearDown(self):
        db.DB_PATH = self.original_db_path
        db.SCHEMA_PATH = self.original_schema_path
        self.temp_dir.cleanup()

    def test_init_db_seeds_votes_only_once_per_day(self):
        initial_votes = db.get_votes_by_building_date(1, date.today())
        self.assertIsNotNone(initial_votes)

        db.init_db()
        votes_after_second_init = db.get_votes_by_building_date(1, date.today())

        conn = db.get_db_connection()
        row_count = conn.execute(
            'SELECT COUNT(*) AS count FROM votes WHERE building_id = ? AND vote_date = ?',
            (1, date.today()),
        ).fetchone()['count']
        conn.close()

        self.assertEqual(row_count, 1)
        self.assertEqual(initial_votes['total'], votes_after_second_init['total'])

    def test_update_votes_inserts_missing_day(self):
        future_date = date(2099, 1, 1)
        self.assertIsNone(db.get_votes_by_building_date(1, future_date))

        db.update_votes(1, 1, 2, 3, 6, future_date)
        saved_votes = db.get_votes_by_building_date(1, future_date)

        self.assertIsNotNone(saved_votes)
        self.assertEqual(saved_votes['total'], 6)
        self.assertEqual(saved_votes['comfort'], 2)

    def test_ensure_votes_for_date_uses_building_defaults(self):
        db.add_building('New Building', 'test')
        building = db.get_building_by_name('New Building')
        db.update_building_settings(building['id'], 3, 4, 5, 26.0, 55.0, 700.0, 48.0, 520.0)

        seeded = db.ensure_votes_for_date(building['id'], date(2099, 2, 2))

        self.assertEqual(seeded['too_cold'], 3)
        self.assertEqual(seeded['comfort'], 4)
        self.assertEqual(seeded['too_warm'], 5)
        self.assertEqual(seeded['total'], 12)

        settings = db.get_building_settings(building['id'])
        self.assertEqual(settings['default_co2'], 700.0)
        self.assertEqual(settings['default_noise'], 48.0)
        self.assertEqual(settings['default_light'], 520.0)

    def test_algorithm_weights_can_be_updated(self):
        db.update_algorithm_weights({
            'too_cold': -0.8,
            'comfort': 1.2,
            'too_warm': -0.4,
            'temp_factor': 0.2,
        })

        weights = db.get_algorithm_weights()

        self.assertEqual(weights['too_cold'], -0.8)
        self.assertEqual(weights['comfort'], 1.2)
        self.assertEqual(weights['too_warm'], -0.4)
        self.assertEqual(weights['temp_factor'], 0.2)

    def test_chat_session_and_messages_are_persisted(self):
        session_id = db.create_chat_session(building_id=1, room_label='Room 301')
        db.add_chat_message(session_id, 'user', 'It is too cold here', 'service_request')
        db.add_chat_message(session_id, 'assistant', 'I can help log that.', 'service_request')

        session = db.get_chat_session(session_id)
        messages = db.get_chat_messages(session_id)

        self.assertEqual(session['building_id'], 1)
        self.assertEqual(session['room_label'], 'Room 301')
        self.assertEqual(len(messages), 2)
        self.assertEqual(messages[0]['role'], 'user')

    def test_service_request_can_be_created(self):
        session_id = db.create_chat_session(building_id=1, room_label='Room 301')
        request_id = db.create_service_request(
            session_id,
            1,
            'Room 301',
            'too_cold',
            'medium',
            'User reported recurring cold discomfort in Room 301.',
        )

        requests = db.get_open_service_requests(session_id)

        self.assertEqual(requests[0]['id'], request_id)
        self.assertEqual(requests[0]['request_type'], 'too_cold')

    def test_delete_building_removes_building_settings(self):
        db.add_building('Delete Me', 'test')
        building = db.get_building_by_name('Delete Me')

        db.delete_building(building['id'])

        self.assertIsNone(db.get_building_by_name('Delete Me'))
        self.assertIsNone(db.get_building_settings(building['id']))


class AlgorithmTests(unittest.TestCase):
    def test_weighted_comfort_handles_zero_total(self):
        score = algorithms.calculate_weighted_comfort(
            {
                'too_cold': 0,
                'comfort': 0,
                'too_warm': 0,
                'total': 0,
            }
        )

        self.assertEqual(score, 0.0)


@unittest.skipIf(app_module is None, 'Flask is not installed in this environment')
class ApiTests(unittest.TestCase):
    def setUp(self):
        self.original_db_path = db.DB_PATH
        self.original_schema_path = db.SCHEMA_PATH
        self.temp_dir = tempfile.TemporaryDirectory()
        db.DB_PATH = os.path.join(self.temp_dir.name, 'test.db')
        db.SCHEMA_PATH = os.path.join(os.path.dirname(__file__), '..', 'src', 'schema.sql')
        db.init_db()
        app_module.app.config['TESTING'] = True
        self.client = app_module.app.test_client()

    def tearDown(self):
        db.DB_PATH = self.original_db_path
        db.SCHEMA_PATH = self.original_schema_path
        self.temp_dir.cleanup()

    def test_add_building_rejects_duplicate_name(self):
        response = self.client.post(
            '/api/buildings',
            json={'name': 'Engineering Hall A', 'description': 'duplicate'},
        )

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.get_json()['error'], 'Building name already exists')

    def test_update_building_rejects_duplicate_name(self):
        response = self.client.put(
            '/api/buildings/2',
            json={'name': 'Engineering Hall A', 'description': 'duplicate'},
        )

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.get_json()['error'], 'Building name already exists')


if __name__ == '__main__':
    unittest.main()
