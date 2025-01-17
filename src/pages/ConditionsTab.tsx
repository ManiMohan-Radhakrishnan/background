import { IonContent, IonPage } from "@ionic/react";
import "./ConditionsTab.css";
import CurrentConditions from "../components/CurrentConditions";
import { useApp } from "../context/AppContext";

const ConditionsTab: React.FC = () => {
  const { conditions, lastUpdated, user } = useApp();
  return (
    <IonPage>
      <IonContent fullscreen>
        <CurrentConditions conditions={conditions} lastUpdated={lastUpdated} />
      </IonContent>
    </IonPage>
  );
};

export default ConditionsTab;
