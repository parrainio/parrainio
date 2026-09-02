"use client";

import { useState } from "react";
import styles from "./CopyCodeButton.module.css";

type CopyTextButtonProps = {
  value: string;
  label: string;
  copiedLabel: string;
};

export default function CopyTextButton({ value, label, copiedLabel }: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "true");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <button type="button" className={styles.button} onClick={copyValue}>{copied ? copiedLabel : label}</button>;
}
