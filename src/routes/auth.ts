import { Router, Request, Response } from "express";
import supabase from "../supabaseClient";

const router = Router();

// Register user
router.post("/register", async (req: Request, res: Response) => {
    const { email, password, displayName } = req.body;

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            display_name: displayName,
        }
    });

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ user: data.user });
});

// Login user
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) return res.status(400).json({ error: error.message });

    res.json({ session: data.session, user: data.user });
});

// Logout user
router.post("/logout", async (_req: Request, res: Response) => {
    const { error } = await supabase.auth.signOut();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Logout successful" });
});

// Get all users
router.get("/users", async (req: Request, res: Response) => {
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json({ users: data.users });
});

// Update user
router.put("/update/:id", async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { email, displayName } = req.body;

    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        email,
        user_metadata: {
            display_name: displayName,
        },
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ user: data.user });
});


export default router;
