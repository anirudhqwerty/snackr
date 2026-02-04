import { Request, Response } from "express";
import * as userService from "../services/user.service";

export async function getCurrentUserHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const profile = await userService.getOrCreateUserProfile(req.user.userId);

    res.status(200).json({
      success: true,
      data: {
        id: profile.id,
        authUserId: profile.auth_user_id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        bio: profile.bio,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get profile";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

export async function updateCurrentUserHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { firstName, lastName, phone, bio } = req.body;
    const profile = await userService.updateProfile(
      req.user.userId,
      firstName,
      lastName,
      phone,
      bio,
    );

    res.status(200).json({
      success: true,
      data: {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        bio: profile.bio,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

export async function getUserAddressesHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const addresses = await userService.getAddresses(req.user.userId);

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get addresses";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

export async function createUserAddressHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const {
      streetAddress,
      city,
      label,
      state,
      postalCode,
      country,
      latitude,
      longitude,
    } = req.body;

    if (!streetAddress || !city) {
      res.status(400).json({
        error: "Street address and city are required",
      });
      return;
    }

    const address = await userService.createAddress(
      req.user.userId,
      streetAddress,
      city,
      label,
      state,
      postalCode,
      country,
      latitude,
      longitude,
    );

    res.status(201).json({
      success: true,
      data: address,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create address";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

export async function updateUserAddressHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const address = await userService.updateAddress(id, req.body);

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update address";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

export async function deleteUserAddressHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const deleted = await userService.deleteAddress(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: "Address not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Address deleted",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete address";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}

export async function setDefaultAddressHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { id } = req.params;
    const address = await userService.setDefaultAddressForUser(
      req.user.userId,
      id,
    );

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to set default address";
    res.status(500).json({
      success: false,
      error: message,
    });
  }
}
