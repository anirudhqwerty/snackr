-- Create enum type for user roles
CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'delivery');

-- Create auth_users table
CREATE TABLE auth_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_auth_users_email ON auth_users(email);

-- Create index on created_at for time-based queries
CREATE INDEX idx_auth_users_created_at ON auth_users(created_at);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_auth_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the update function before any UPDATE
CREATE TRIGGER auth_users_updated_at_trigger
BEFORE UPDATE ON auth_users
FOR EACH ROW
EXECUTE FUNCTION update_auth_users_updated_at();
