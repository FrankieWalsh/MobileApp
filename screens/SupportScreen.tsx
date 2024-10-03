import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';

const SupportScreen: React.FC = () => {
    // Estado para controlar qué FAQ está abierto
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);

    // Datos de las FAQs
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

    // Función para manejar el despliegue de las FAQs
    const toggleFAQ = (id: number) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                        {/* Respuesta desplegable */}
                        {openFAQ === faq.id && (
                            <View style={styles.faqAnswerContainer}>
                                <Text style={styles.faqAnswer}>{faq.answer}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    faqContainer: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    faqQuestionContainer: {
        paddingVertical: 10,
    },
    faqQuestion: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
    },
    faqAnswerContainer: {
        paddingVertical: 10,
    },
    faqAnswer: {
        fontSize: 16,
        color: '#333',
    },
});

export default SupportScreen;
