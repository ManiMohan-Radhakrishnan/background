import React, { useEffect } from "react";
import { IonButton } from "@ionic/react";
import { format } from "date-fns";

import { WeatherCondition } from "../context/AppContext";
import { useApp } from "../context/AppContext";

import styles from "./CurrentConditions.module.css";

interface CurrentConditionsProps {
  conditions: WeatherCondition;
  lastUpdated?: Date;
}

const CurrentConditions: React.FC<CurrentConditionsProps> = ({}) => {
  const { requestPermissions, user } = useApp();
  console.log("🚀 ~ CurrentConditions user:", user?.timestamp);

  // Request permissions on component mount
  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  return (
    <div className={styles.conditions}>
      <div className={styles.inner}>
        <h2 className={styles.temp}>{user?.message}&deg;</h2>

        <h4 className={styles.timestamp}>Timer {user?.timestamp}</h4>
      </div>
    </div>
  );
};

export default CurrentConditions;
