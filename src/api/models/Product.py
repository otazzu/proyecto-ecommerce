from api.database.db import db
from sqlalchemy import String, Float, ForeignKey, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

class Product(db.Model):

    __tablename__="product"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    img: Mapped[str] = mapped_column(String(255), nullable=True)
    video: Mapped[str] = mapped_column(String(500), nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    url: Mapped[str] = mapped_column(String(120), nullable=True)
    review: Mapped[float] = mapped_column(Float, nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    status: Mapped[bool] = mapped_column(Boolean, nullable=True, default=True)

    user = relationship("User")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")

    def serialize(self):
        return{
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "img": self.img,
            "video":self.video,
            "price": self.price,
            "url": self.url,
            "review": self.review,
            "user_id": self.user_id,
            "user": self.user.serialize() if self.user else None,
            "status": self.status
        }