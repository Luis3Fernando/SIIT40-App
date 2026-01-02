import { useState } from 'react';
import { Alert } from 'react-native';
import { resetDevice } from '@services/esp32Service';

export const useResetDevice = () => {
  const [isResetting, setIsResetting] = useState(false);

  const triggerReset = async () => {
    Alert.alert(
      "Reiniciar Invernadero",
      "¿Estás seguro de reiniciar el ESP32? El sistema estará fuera de línea por unos segundos.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Reiniciar", 
          onPress: async () => {
            setIsResetting(true);
            await resetDevice();    
            Alert.alert("Éxito", "Comando de reinicio enviado.");
            setIsResetting(false);
          }
        }
      ]
    );
  };

  return { triggerReset, isResetting };
};