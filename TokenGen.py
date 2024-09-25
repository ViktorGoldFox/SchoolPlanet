import secrets

def generateNewToken():
    return secrets.token_urlsafe(16)