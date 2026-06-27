"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Store, Recycle } from "lucide-react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function GoogleRoleModal() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState("buyer");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const checkUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.email}`
        );

        const text = await res.text();
        if (!text) {
          setShowModal(true);
          return;
        }

        const data = JSON.parse(text);

        if (!data || !data._id) {
          setShowModal(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkUser();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          image: user.image || "",
          role: selected,
          phone: "",
          location: "",
        }),
      });

      toast.success(`Registered as ${selected}!`);
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col gap-6">
        <div className="text-center">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 w-fit mx-auto mb-3">
            <Recycle className="h-6 w-6 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">
            How will you use ReSell Hub?
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Choose your role to continue</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelected("buyer")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
              selected === "buyer"
                ? "border-purple-500 bg-purple-500/10 text-purple-400"
                : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
            }`}
          >
            <ShoppingBag className="size-6" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold">Buyer</span>
              <span className="text-[11px] text-zinc-500">Browse & buy</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelected("seller")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
              selected === "seller"
                ? "border-purple-500 bg-purple-500/10 text-purple-400"
                : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
            }`}
          >
            <Store className="size-6" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold">Seller</span>
              <span className="text-[11px] text-zinc-500">List & sell</span>
            </div>
          </button>
        </div>

        <Button
          onClick={handleSave}
          isDisabled={saving}
          className="w-full py-6 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all"
        >
          {saving ? "Saving..." : `Continue as ${selected === "buyer" ? "Buyer" : "Seller"}`}
        </Button>
      </div>
    </div>
  );
}