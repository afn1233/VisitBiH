from pydantic import BaseModel


class CityCount(BaseModel):
    city: str
    count: int


class StatsOut(BaseModel):
    total_links: int
    distinct_cities: int
    per_city: list[CityCount]
