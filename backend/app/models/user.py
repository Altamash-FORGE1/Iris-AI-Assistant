import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from app import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    vision_profile = db.relationship('VisionProfile', back_populates='user', uselist=False)
    iris_scans = db.relationship('IrisScan', back_populates='user', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': str(self.id),
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
