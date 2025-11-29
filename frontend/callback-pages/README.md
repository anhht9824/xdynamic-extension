# Callback Pages

Static HTML pages used as redirect/landing screens for OAuth and payment callbacks.
The FastAPI app serves this directory at `/fe` when `DEBUG=true`, so keep the
markup framework-free and avoid backend-only assets here. Update links in the
backend config (`APP_URL`) if these pages move or are hosted elsewhere.
