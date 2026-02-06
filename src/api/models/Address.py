from api.database.db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String, Boolean


class Address(db.Model):
    __tablename__ = "address"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    street: Mapped[str] = mapped_column(String(255), nullable=False)
    number: Mapped[str] = mapped_column(String(20), nullable=False)
    apartment: Mapped[str] = mapped_column(String(50), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    province: Mapped[str] = mapped_column(String(100), nullable=False)
    postal_code: Mapped[str] = mapped_column(String(20), nullable=False)
    country: Mapped[str] = mapped_column(
        String(100), nullable=False, default="España")
    phone: Mapped[str] = mapped_column(String(20), nullable=True)
    is_default: Mapped[bool] = mapped_column(
        Boolean, default=False)

    user = relationship("User", back_populates="addresses")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "street": self.street,
            "number": self.number,
            "apartment": self.apartment,
            "city": self.city,
            "province": self.province,
            "postal_code": self.postal_code,
            "country": self.country,
            "phone": self.phone,
            "is_default": self.is_default
        }
