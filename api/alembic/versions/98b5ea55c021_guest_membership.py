"""guest membership state

Revision ID: 98b5ea55c021
Revises: 7ad951be2301
"""

import sqlalchemy as sa
from alembic import op

revision = "98b5ea55c021"
down_revision = "7ad951be2301"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "guestmembership",
        sa.Column("guest_id", sa.Uuid(), nullable=False),
        sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.PrimaryKeyConstraint("guest_id"),
    )


def downgrade():
    op.drop_table("guestmembership")
