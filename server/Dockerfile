    FROM python:3.12.0-slim-bookworm

    ENV PYTHONBUFFERED 1
    ENV PYTHONWRITEBYTECODE 1

    ENV APP=/app

    # Change the workdir.
    WORKDIR $APP

    # Install dependencies first for better caching
    COPY requirements.txt .
    RUN pip3 install --no-cache-dir -r requirements.txt

    # Copy the rest of the application code
    COPY . .

    EXPOSE 8000

    # Ensure the entrypoint script is executable
    RUN chmod +x /app/entrypoint.sh

    # Create a non-root user and switch to it
    RUN adduser --disabled-password appuser && chown -R appuser $APP
    USER appuser

    # Entrypoint and command to run the application
    ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]
    CMD ["gunicorn", "--bind", ":8000", "--workers", "3", "djangoproj.wsgi"]
