"use client";

import { useCallback, useState } from "react";

/**
 * @typedef {"districts" | "mfy" | "schools"} PanelTab
 * @typedef {"mfy" | "schools"} NestedView
 */

export default function usePanelState() {
  const [activeRegion, setActiveRegion] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  /** @type {[PanelTab, (value: PanelTab) => void]} */
  const [activeTab, setActiveTab] = useState("districts");
  const [activeDistrict, setActiveDistrict] = useState(null);
  const [isNestedOpen, setIsNestedOpen] = useState(false);
  /** @type {[NestedView, (value: NestedView) => void]} */
  const [nestedView, setNestedView] = useState("mfy");

  const openRegionPanel = useCallback((regionName) => {
    setActiveRegion(regionName);
    setIsPanelOpen(true);
    setActiveTab("districts");
    setActiveDistrict(null);
    setIsNestedOpen(false);
    setNestedView("mfy");
  }, []);

  const closeRegionPanel = useCallback(() => {
    setIsPanelOpen(false);
    setActiveRegion(null);
    setActiveDistrict(null);
    setIsNestedOpen(false);
    setNestedView("mfy");
  }, []);

  /**
   * @param {PanelTab} tabKey
   */
  const switchTab = useCallback((tabKey) => {
    setActiveTab(tabKey);
    setActiveDistrict(null);
    setIsNestedOpen(false);
    setNestedView("mfy");
  }, []);

  const openNestedPanel = useCallback((districtName) => {
    setActiveDistrict(districtName);
    setIsNestedOpen(true);
    setNestedView("mfy");
  }, []);

  const closeNestedPanel = useCallback(() => {
    setIsNestedOpen(false);
    setActiveDistrict(null);
    setNestedView("mfy");
  }, []);

  /**
   * @param {NestedView} viewKey
   */
  const changeNestedView = useCallback((viewKey) => {
    setNestedView(viewKey);
  }, []);

  return {
    activeRegion,
    isPanelOpen,
    activeTab,
    activeDistrict,
    isNestedOpen,
    nestedView,
    openRegionPanel,
    closeRegionPanel,
    switchTab,
    openNestedPanel,
    closeNestedPanel,
    changeNestedView,
  };
}


