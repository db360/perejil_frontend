import { useState } from "react";
import { MenuButton } from "./MenuButton";

export default function HamburguerMenu() {

    const [isOpen, setOpen] = useState(false);
    const menuButtonStyle = {
    marginLeft: "2rem"
  };
    return (
        <MenuButton
        isOpen={isOpen}
        onClick={() => setOpen(!isOpen)}
        strokeWidth={8}
        color="#0E3D13"
        lineProps={{ strokeLinecap: "round" }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        width={24}
        height={24}
        style={menuButtonStyle}
      />
    )
}