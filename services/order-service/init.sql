CREATE TABLE orders (
  id UUID PRIMARY KEY,
  food_id UUID NOT NULL,
  status TEXT CHECK (status IN ('pending','picked','delivered')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
