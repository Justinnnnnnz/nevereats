"""guest promotions

Revision ID: 7ad951be2301
Revises: 316a2ecdad2e
"""

import sqlalchemy as sa
from alembic import op

revision = "7ad951be2301"
down_revision = "316a2ecdad2e"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "promotion",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("guest_id", sa.Uuid(), nullable=False),
        sa.Column("kind", sa.String(), nullable=False),
        sa.Column("code", sa.String(), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used_order_id", sa.Uuid(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_promotion_guest_id"), "promotion", ["guest_id"])
    op.create_index(op.f("ix_promotion_used_order_id"), "promotion", ["used_order_id"])
    op.add_column(
        "order",
        sa.Column("discount_cents", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column("order", sa.Column("promotion_id", sa.Uuid(), nullable=True))
    op.create_foreign_key(
        "fk_order_promotion_id", "order", "promotion", ["promotion_id"], ["id"]
    )


def downgrade():
    op.drop_constraint("fk_order_promotion_id", "order", type_="foreignkey")
    op.drop_column("order", "promotion_id")
    op.drop_column("order", "discount_cents")
    op.drop_index(op.f("ix_promotion_used_order_id"), table_name="promotion")
    op.drop_index(op.f("ix_promotion_guest_id"), table_name="promotion")
    op.drop_table("promotion")
