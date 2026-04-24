import uuid
from datetime import datetime
import enum
from sqlalchemy.dialects.postgresql import JSONB, UUID
from app import db


class UrgencyLevel(enum.Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'
    CRITICAL = 'critical'


class IrisScan(db.Model):
    __tablename__ = 'iris_scans'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    symptom_focus = db.Column(JSONB, nullable=True, default=dict)
    patient_query = db.Column(db.Text, nullable=True)
    detected_condition = db.Column(db.String(200), nullable=True)
    probability_index = db.Column(db.Float, nullable=True)
    urgency_level = db.Column(db.Enum(UrgencyLevel, name='urgency_level', validate_strings=True), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship('User', back_populates='iris_scans')

    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'symptom_focus': self.symptom_focus,
            'patient_query': self.patient_query,
            'detected_condition': self.detected_condition,
            'probability_index': self.probability_index,
            'urgency_level': self.urgency_level.value if self.urgency_level else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
