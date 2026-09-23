"""initial empty baseline

Revision ID: 0001
Revises:
Create Date: 2026-09-23

Intentionally empty: it establishes the migration chain and creates the
alembic_version table. Real tables arrive with the first domain model.
"""

from collections.abc import Sequence

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
