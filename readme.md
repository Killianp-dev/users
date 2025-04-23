# Django Project

🖥️ This project is a Django application configured for user authentication via email, custom user management, and a simple UI to log in and view user profiles.

## Prerequisites
- Python 3.9 or later
- pip (comes with Python)
- Virtual environment (optional but recommended)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/Killianp-dev/users
cd <REPOSITORY_NAME>
```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables in a `.env` file at the root of the project. Example:
```
DJANGO_SECRET_KEY='your-django-secret-key'
```

4. Apply migrations:
```bash
python manage.py migrate
```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

6. Access the application in your browser at `http://127.0.0.1:8000/`.

## Features

### Custom Authentication
- Custom user model (`CustomUser`) with email as the main identifier.
- User management through Django Admin.
- Email verification using Django Allauth.

### User Interface
- Login page (`login.html`).
- Profile page (`profile.html`) displaying logged-in user information.

### Testing and Quality
- Unit tests for the `CustomUser` model using pytest.
- pytest configuration available in `pytest.ini`.

## Project Structure
- `models.py`: Custom user model.
- `views.py`: Views for redirection and profile page.
- `urls.py`: URL routing for the application.
- `templates/`: HTML templates with authentication management.
- `static/css/style.css`: CSS file for application styling.
- `requirements.txt`: List of Python dependencies.
- `.env`: Environment variables (example included).

## Tests
To run tests:
```bash
pytest
```

## Deployment

### Static Files
Prepare static files for production:
```bash
python manage.py collectstatic
```

### Production with WSGI
Use the provided `wsgi.py` to set up the project with a WSGI server such as Gunicorn or uWSGI.

### ASGI for WebSockets
`asgi.py` is included for setups requiring ASGI protocol (e.g., WebSockets).

## Contributors
- KillianP

## License
This project is under the MIT License.
