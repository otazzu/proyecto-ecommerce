from api.database.db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Float, Text, DateTime
import datetime

class Review(db.Model):

    __tablename__ = "review"

    id: Mapped[int] = mapped_column(primary_key=True)
    stripe_id: Mapped[int] = mapped_column(
        ForeignKey("stripe_pay.id"), nullable=False)
    client_id: Mapped[str] = mapped_column(ForeignKey("user.id"))
    product_id: Mapped[str] = mapped_column(ForeignKey("product.id"))
    client_rate: Mapped[int] = mapped_column(Float, nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.datetime.now)

    client = relationship("User")
    product = relationship("Product", back_populates="reviews")

    def serialize(self):
        return {
            "id": self.id,
            "stripe_id": self.stripe_id,
            "client_id": self.client_id,
            "product_id": self.product_id,
            "client_rate": self.client_rate,
            "comment": self.comment,
            "created_at":  self.created_at.strftime("%d/%m/%Y") if self.created_at else None,
            "client": self.client.serialize() if self.client else None
        }
