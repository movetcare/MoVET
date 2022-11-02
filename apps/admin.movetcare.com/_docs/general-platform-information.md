---
title: 'General Platform Information'
excerpt: 'Learn about the various technologies, tools, and services that power MoVET'
---

## Appointment Booking Object

```
{
    bookingId: string;
    clientId: string;
    staffId: string;
    isNewClient: boolean;
    reasonGroup: number;
    reasonType: number;
    step: 'started' | 'contact-info' | 'waiting-on-auth' | 'patient-selection' | 'wellness-check' | 'illness-assignment' | 'upload-records' | 'choose-location'  | 'choose-reason' | 'choose-staff' | 'choose-datetime' | 'confirmation'
    location: 'home' | 'clinic' | 'virtual'
    datetime: Date;
    paymentMethodRequired: boolean;
    checkoutUrl: string;
    source: 'web' | 'mobile'
    createdAt: Date;
    updatedOn: Date;
    clientData: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email:string;
    }
    patientData: [
        {
            id:string;
            name: string;
            species: 'canine' | 'feline'
            breed: string;
            sex: 'male' | 'female'
            birthday: string;
            recordsUploaded: boolean | null;
            vcprRequired: boolean;
        }
    ]
     illPatients: [
        {
           id: string;
           symptoms: Array<string>;
           note: string;
        }
    ]

}
```
