import {
    createUserAddress,
    createUserProfile,
    deleteUserAddress,
    getUserAddresses,
    getUserProfileByAuthId,
    setDefaultAddress,
    updateUserAddress,
    updateUserProfile,
    UserAddress,
    UserProfile,
} from "../db/queries/user.queries";

export async function getOrCreateUserProfile(
  authUserId: string,
): Promise<UserProfile> {
  let profile = await getUserProfileByAuthId(authUserId);
  if (!profile) {
    profile = await createUserProfile(authUserId);
  }
  return profile;
}

export async function updateProfile(
  authUserId: string,
  firstName?: string,
  lastName?: string,
  phone?: string,
  bio?: string,
): Promise<UserProfile> {
  return await updateUserProfile(authUserId, firstName, lastName, phone, bio);
}

export async function createAddress(
  authUserId: string,
  streetAddress: string,
  city: string,
  label?: string,
  state?: string,
  postalCode?: string,
  country?: string,
  latitude?: number,
  longitude?: number,
): Promise<UserAddress> {
  const profile = await getOrCreateUserProfile(authUserId);
  return await createUserAddress(
    profile.id,
    streetAddress,
    city,
    label,
    state,
    postalCode,
    country,
    latitude,
    longitude,
  );
}

export async function getAddresses(authUserId: string): Promise<UserAddress[]> {
  const profile = await getOrCreateUserProfile(authUserId);
  return await getUserAddresses(profile.id);
}

export async function updateAddress(
  addressId: string,
  updates: Partial<UserAddress>,
): Promise<UserAddress> {
  return await updateUserAddress(addressId, updates);
}

export async function deleteAddress(addressId: string): Promise<boolean> {
  return await deleteUserAddress(addressId);
}

export async function setDefaultAddressForUser(
  authUserId: string,
  addressId: string,
): Promise<UserAddress> {
  const profile = await getOrCreateUserProfile(authUserId);
  return await setDefaultAddress(profile.id, addressId);
}
