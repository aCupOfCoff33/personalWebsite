import React from "react";
import { BEAR_MODES } from "../../../constants/bearModes";
import Laptop from "./Laptop";
import Book from "./Book";
import QuarterZip from "./QuarterZip";

const ACCESSORY_MAP = {
  [BEAR_MODES.PROJECTS]: Laptop,
  [BEAR_MODES.STORIES]: Book,
  [BEAR_MODES.ABOUT]: QuarterZip,
};

export const hasAccessoryForType = (type) => Boolean(ACCESSORY_MAP[type]);

const BearAccessoryManager = React.memo(function BearAccessoryManager({
  type,
  position = "visible",
  idSuffix = "",
}) {
  const Comp = ACCESSORY_MAP[type];
  if (!Comp) return null;
  return <Comp position={position} idSuffix={idSuffix} />;
});

BearAccessoryManager.displayName = "BearAccessoryManager";

export default BearAccessoryManager;
