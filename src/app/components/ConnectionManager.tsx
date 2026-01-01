import React, { useEffect } from 'react';
import * as Network from 'expo-network';
import { useDispatch } from 'react-redux';
import { setConnectionInfo } from '@redux/slices/connectionSlice';

export const ConnectionManager = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const subscription = Network.addNetworkStateListener(state => {
      const isWiFi = state.type === Network.NetworkStateType.WIFI;
      
      if (isWiFi) {
        dispatch(setConnectionInfo({ ssid: 'WIFI_DETECTED', isSIIT40: true }));
      } else {
        dispatch(setConnectionInfo({ ssid: null, isSIIT40: false }));
      }
    });

    return () => subscription.remove();
  }, []);

  return null;
};