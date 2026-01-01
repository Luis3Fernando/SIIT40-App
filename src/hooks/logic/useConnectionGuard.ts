import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@redux/store';
import { setConnectionInfo, setApiStatus } from '@redux/slices/connectionSlice';
import { esp32Service } from '@services/esp32Service';
import * as Network from 'expo-network';

export const useConnectionGuard = () => {
  const dispatch = useDispatch();
  const { isConnectedToGateway, isApiReachable, currentSSID } = useSelector(
    (state: RootState) => state.connection
  );

  const checkNetwork = useCallback(async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      const hasWifi = state.type === Network.NetworkStateType.WIFI;

      if (!hasWifi) {
        dispatch(setConnectionInfo({ ssid: null, isSIIT40: false }));
        dispatch(setApiStatus(false));
        return;
      }

      const response = await esp32Service.fetchCurrentStatus();
      
      if (response && !('type' in response)) {
        dispatch(setConnectionInfo({ ssid: 'SIIT40_GATEWAY', isSIIT40: true }));
        dispatch(setApiStatus(true));
      } else {
        dispatch(setApiStatus(false));
      }
    } catch (error) {
      dispatch(setApiStatus(false));
    }
  }, [dispatch]);

  useEffect(() => {
    checkNetwork();
  }, [checkNetwork]);

  return {
    isConnected: isConnectedToGateway && isApiReachable,
    isApiReachable,
    currentSSID,
    checkNetwork
  };
};