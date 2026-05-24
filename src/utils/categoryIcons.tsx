import React from "react";
import DevicesOtherOutlinedIcon from "@mui/icons-material/DevicesOtherOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

/**
 * Resolve a distinct icon per item category by name.
 *
 * The backend currently returns `icon_path` as bare filenames that don't
 * resolve to served assets, so every card used to fall back to a single
 * (shirt-like) image. This maps known categories to MUI icons and uses a
 * neutral box for anything unknown — never a shirt.
 */
export const getCategoryIcon = (name?: string): React.ReactNode => {
  const n = (name || "").toLowerCase();
  const sx = { fontSize: 32, color: "#559999" } as const;

  if (/(electronic|gadget|device|tech|computer|phone)/.test(n))
    return <DevicesOtherOutlinedIcon sx={sx} />;
  if (/(fragile|care|delicate)/.test(n)) return <WarningAmberOutlinedIcon sx={sx} />;
  if (/(document|essential|paper|passport)/.test(n))
    return <DescriptionOutlinedIcon sx={sx} />;
  if (/(gift|personal|souvenir)/.test(n)) return <CardGiftcardOutlinedIcon sx={sx} />;
  if (/(health|beauty|cosmetic|skincare)/.test(n)) return <SpaOutlinedIcon sx={sx} />;

  return <Inventory2OutlinedIcon sx={sx} />; // Other / unknown — neutral box
};
