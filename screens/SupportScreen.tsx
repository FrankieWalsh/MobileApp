import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Header from "../header/header";
import { useNavigation } from '@react-navigation/native';  // Import useNavigation

const SupportScreen: React.FC = () => {
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const navigation = useNavigation();

    const faqs = [
        {
            id: 1,
            question: 'How do I create a booking?',
            answer: 'To create a booking, go to the main screen, select your preferred location and dates, then choose a car from the list and click "Book Now".'
        },
        {
            id: 2,
            question: 'What are the accepted payment methods?',
            answer: 'We accept all major credit cards and PayPal for online payments. For in-person payments, cash is also accepted.'
        },
        {
            id: 3,
            question: 'Can I cancel my booking?',
            answer: 'Yes, you can cancel your booking up to 24 hours before the start date without any cancellation fee. After that, a small fee may apply.'
        }
    ];

    const toggleFAQ = (id: number) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <Header />

            {/* Espacio adicional debajo del header */}
            <View style={styles.headerSpace}></View>

            {/* Contenido principal con ScrollView */}
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Sección de Contact Us */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <Text style={styles.text}>Email: support@carrentalapp.com</Text>
                    <Text style={styles.text}>Phone: +1-234-567-8900</Text>
                    <Text style={styles.text}>Address: 123 Main Street, Odense, Denmark</Text>
                </View>

                {/* Sección de FAQs */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>FAQs</Text>
                    {faqs.map((faq) => (
                        <View key={faq.id} style={styles.faqContainer}>
                            <TouchableOpacity onPress={() => toggleFAQ(faq.id)} style={styles.faqQuestionContainer}>
                                <Text style={styles.faqQuestion}>{faq.question}</Text>
                            </TouchableOpacity>
                            {openFAQ === faq.id && (
                                <View style={styles.faqAnswerContainer}>
                                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
            {/* Add a Home button at the bottom */}
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.homeButtonText}>Go to Home</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f9',
    },
    headerSpace: {
        marginTop: 150,
    },
    contentContainer: {
        padding: 20,
    },
    section: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    sectionTitle: {
        fontFamily: "Montserrat-Bold",
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6836F5',
    },
    text: {
        fontFamily: "Montserrat-Medium",
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    faqContainer: {
        marginBottom: 15,
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    faqQuestionContainer: {
        paddingVertical: 10,
    },
    faqQuestion: {
        fontFamily: "Montserrat-Medium",
        fontSize: 18,
        fontWeight: '500',
        color: '#6836F5',
    },
    faqAnswerContainer: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#e2e2ff',
        borderRadius: 8,
    },
    faqAnswer: {
        fontFamily: "Montserrat-Medium",
        fontSize: 16,
        color: '#555',
    },
    homeButton: {
        backgroundColor: '#6836F5',
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginHorizontal: 20,
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    homeButtonText: {
        fontFamily: "Montserrat-Bold",
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

});

export default SupportScreen;
