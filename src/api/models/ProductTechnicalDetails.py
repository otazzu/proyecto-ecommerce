from api.database.db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, String


class ProductTechnicalDetails(db.Model):
    __tablename__ = "product_technical_details"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("product.id"), nullable=False, unique=True)
    manufacturer: Mapped[str] = mapped_column(String(120), nullable=True)
    collection: Mapped[str] = mapped_column(String(120), nullable=True)
    anime_series: Mapped[str] = mapped_column(String(200), nullable=True)
    character: Mapped[str] = mapped_column(String(120), nullable=True)

    product = relationship("Product", back_populates="technical_details")

    def serialize(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "manufacturer": self.manufacturer,
            "collection": self.collection,
            "anime_series": self.anime_series,
            "character": self.character,
        }
