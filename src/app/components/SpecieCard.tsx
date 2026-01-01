import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@theme/Colors';
import { PlantData } from '@models/PlantData';

interface SpecieCardProps {
    item: PlantData;
    onPress: () => void;
}

const SpecieCard = ({ item, onPress }: SpecieCardProps) => {
    const isDark = item.isCritical;
    const bgColor = isDark ? AppColors.DARK_COLOR : AppColors.WHITE;
    const titleColor = isDark ? AppColors.WHITE : AppColors.DARK_COLOR;
    const subColor = isDark ? '#A0A0A0' : AppColors.TEXT_GRAY; 
    const tagColor = isDark ? AppColors.PRIMARY_COLOR : AppColors.SECUNDARY_COLOR; 

    return (
        <TouchableOpacity 
            activeOpacity={0.7}
            style={[styles.cardContainer, { backgroundColor: bgColor }]}
            onPress={onPress}
        >
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: item.imageUrl }} 
                    style={[styles.imageStyle, { backgroundColor: item.color || AppColors.LIGHT_COLOR }]} 
                    resizeMode="cover"
                />
            </View>

            <View style={styles.contentArea}>
                <View style={[styles.stagePill, { backgroundColor: tagColor }]}>
                    <Text style={styles.stageText}>{item.stage}</Text>
                </View>
                <Text style={[styles.nameText, { color: titleColor }]} numberOfLines={1}>
                    {item.name}
                </Text>                
                <View style={styles.detailsRow}>
                    <Text style={[styles.countText, { color: subColor }]}>
                        {item.count} ejemplares
                    </Text>
                    <View style={styles.dotSeparator} />
                    <Text style={[styles.zoneText, { color: subColor }]}>
                        {item.zone}
                    </Text>
                </View>
            </View>
            <View style={styles.actionArea}>
                <Ionicons 
                    name="chevron-forward-outline" 
                    size={20} 
                    color={isDark ? AppColors.WHITE : AppColors.TEXT_GRAY} 
                />
            </View>
        </TouchableOpacity>
    );
};

export default SpecieCard;

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    imageContainer: {
        width: 65,
        height: 65,
        borderRadius: 12,
        marginRight: 15,
        overflow: 'hidden',
    },
    imageStyle: {
        width: '100%',
        height: '100%',
    },
    contentArea: {
        flex: 1,
        justifyContent: 'center',
    },
    stagePill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 4,
    },
    stageText: {
        fontSize: 9,
        fontWeight: '800',
        color: AppColors.WHITE,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    nameText: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countText: {
        fontSize: 13,
        fontWeight: '500',
    },
    zoneText: {
        fontSize: 13,
        fontWeight: '600',
    },
    dotSeparator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#D1D1D1',
        marginHorizontal: 8,
    },
    actionArea: {
        marginLeft: 10,
    }
});