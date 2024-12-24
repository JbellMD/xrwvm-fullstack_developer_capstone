from django.core.management.base import BaseCommand
from django.db import connections
from django.db.utils import OperationalError
import time

class Command(BaseCommand):
    help = 'Tests database connection'

    def handle(self, *args, **options):
        self.stdout.write('Testing database connection...')
        
        db_conn = connections['default']
        tries = 0
        max_tries = 3
        
        while tries < max_tries:
            try:
                db_conn.cursor()
                self.stdout.write(self.style.SUCCESS('Database connection successful!'))
                
                # Test query
                with db_conn.cursor() as cursor:
                    cursor.execute('SELECT COUNT(*) FROM dealers')
                    count = cursor.fetchone()[0]
                    self.stdout.write(f'Number of dealers in database: {count}')
                return
                
            except OperationalError as e:
                tries += 1
                if tries == max_tries:
                    self.stdout.write(self.style.ERROR(f'Database connection failed: {e}'))
                    return
                    
                self.stdout.write(f'Connection attempt {tries} failed. Retrying in 3 seconds...')
                time.sleep(3)
