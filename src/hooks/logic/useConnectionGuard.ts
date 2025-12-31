import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@redux/store';
import { setConnectionInfo, setApiStatus } from '@redux/slices/connectionSlice';
import { esp32Service } from '@services/esp32Service';
import * as Network from 'expo-network';

export const useConnectionGuard = () => {
  const dispatch = useDispatch();
  const connection = useSelector((state: RootState) => state.connection);

  const checkNetwork = async () => {
    const state = await Network.getNetworkStateAsync();
    if (state.isConnected) {
      const response = await esp32Service.fetchCurrentStatus();
      
      if ('type' in response) {
        dispatch(setConnectionInfo({ ssid: 'Unknown', isSIIT40: false }));
        dispatch(setApiStatus(false));
      } else {
        dispatch(setConnectionInfo({ ssid: 'SIIT40_GATEWAY', isSIIT40: true }));
        dispatch(setApiStatus(true));
      }
    }
  };

  return {
    isConnected: connection.isConnectedToGateway && connection.isApiReachable,
    currentSSID: connection.currentSSID,
    checkNetwork
  };
};