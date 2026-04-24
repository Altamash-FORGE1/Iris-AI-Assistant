import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB, UUID
from app import db


class VisionProfile(db.Model):
    __tablename__ = 'vision_profiles'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False, unique=True)
    full_name = db.Column(db.String(150), nullable=False)
    biological_sex = db.Column(db.String(16), nullable=True)
    date_of_birth = db.Column(db.Date, nullable=True)
    blood_group = db.Column(db.String(8), nullable=True)
    clinical_history = db.Column(JSONB, nullable=True, default=dict)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship('User', back_populates='vision_profile')

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'full_name': self.full_name,
            'biological_sex': self.biological_sex,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'blood_group': self.blood_group,
            'clinical_history': self.clinical_history,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
