import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

const DashboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Aquí comienza el contenido, justo debajo de la barra de notificaciones.</Text>
    </SafeAreaView>
  )
}

export default DashboardScreen

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#EBEBEB',
    padding: 10,
  },
});