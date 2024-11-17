import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
    providedIn: 'root'
})
export class BookingInvoiceService {
    toProperCase = (text: string) => {
        return text.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    roundOff(num: number) {
        return Math.round((num + Number.EPSILON) * 100) / 100
    }

    public async downloadInvoice(currentBookingData: any) {
        console.log('Booking Data', currentBookingData);
        const doc = new jsPDF({ filters: ['ASCIIHexEncode'] });
        autoTable(doc, {
            body: [
                [
                    {
                        content: 'Jaipur Service Company',
                        styles: {
                            halign: 'left',
                            fontSize: 20,
                            textColor: '#ffffff',
                        },
                    },
                    {
                        content: 'Invoice',
                        styles: {
                            halign: 'right',
                            fontSize: 20,
                            textColor: '#ffffff',
                        },
                    },
                ],
            ],
            theme: 'plain',
            styles: {
                fillColor: 'rgb(82, 86, 89)',
            },
        });
        autoTable(doc, {
            body: [
                [
                    {
                        content: 'GSTN: 09IXVPK0011F1ZE',
                        styles: {
                            halign: 'left',
                            fontSize: 13,
                        },
                    },
                ],
            ],
            theme: 'plain',
        });
        autoTable(doc, {
            body: [
                [
                    {
                        content:
                            'From:' +
                            '\n Jaipur Service Company' +
                            '\n Shop C-01,409/276-277,' +
                            '\n Shakuntalam Apartment,' +
                            '\n Mutthiganj, Near Maya Press' +
                            '\n 211003 - Prayagraj' +
                            '\n India',
                        styles: {
                            halign: 'left',
                        },
                    },
                    {
                        content:
                            'Reference: #' +
                            currentBookingData?.id +
                            '\nDate: ' +
                            new Date(currentBookingData?.completedAt?.seconds * 1000).toLocaleString(),
                        styles: {
                            halign: 'right',
                        },
                    },
                ],
            ],
            theme: 'plain',
        });
        // autoTable(doc, {
        // body: [
        //     [
        //     {
        //         content:
        //         'Billed to:' +
        //             '\n ' +
        //             currentBookingData?.userDetails?.displayName +
        //             '\n ' +
        //             currentBookingData?.userDetails?.email +
        //             '\n ' +
        //             currentBookingData?.userDetails?.phone +
        //             '\n ' +
        //             currentBookingData?.userDetails?.deliveryAddress.address ||
        //         '' +
        //             '\n ' +
        //             currentBookingData?.userDetails?.deliveryAddress.area ||
        //         '' +
        //             '\n ' +
        //             currentBookingData?.userDetails?.deliveryAddress.landmark ||
        //         '' +
        //             '\n ' +
        //             currentBookingData?.userDetails?.deliveryAddress.pinCode ||
        //         '',
        //         styles: {
        //         halign: 'left',
        //         },
        //     },
        //     {
        //         content:
        //         'Pickup address:' +
        //             '\n ' +
        //             currentBookingData?.userDetails?.displayName +
        //             '\n ' +
        //             currentBookingData?.userDetails?.email +
        //             '\n ' +
        //             currentBookingData?.userDetails?.phone +
        //             '\n ' +
        //             currentBookingData?.userDetails?.pickupAddress.address ||
        //         '' +
        //             '\n ' +
        //             currentBookingData?.userDetails?.pickupAddress.area ||
        //         '' +
        //             '\n ' +
        //             currentBookingData?.userDetails?.pickupAddress.landmark ||
        //         '' +
        //             '\n ' +
        //             currentBookingData?.userDetails?.pickupAddress.pinCode ||
        //         '',
        //         styles: {
        //         halign: 'right',
        //         },
        //     },
        //     ],
        // ],
        // theme: 'plain',
        // });
        // autoTable(doc, {
        // body: [
        //     [
        //     {
        //         content: 'Amount due:',
        //         styles: {
        //         halign: 'right',
        //         fontSize: 14,
        //         },
        //     },
        //     ],
        //     [
        //     {
        //         content: 'INR ' + currentBookingData?.billingDetail?.grandTotal,
        //         styles: {
        //         halign: 'right',
        //         fontSize: 20,
        //         textColor: '#3366ff',
        //         },
        //     },
        //     ],
        //     [
        //     {
        //         content:
        //         'Due date: ' +
        //         currentBookingData?.slot?.date.toDate().toLocaleString(),
        //         styles: {
        //         halign: 'right',
        //         },
        //     },
        //     ],
        // ],
        // theme: 'plain',
        // });
        autoTable(doc, {
            body: [
                [
                    {
                        content: 'Products & Services',
                        styles: {
                            halign: 'left',
                            fontSize: 14,
                        },
                    },
                ],
            ],
            theme: 'plain',
        });

        for (const service of currentBookingData.services) {
            autoTable(doc, {
                body: [
                    [
                        {
                            content: this.toProperCase(service.name),
                            styles: {
                                halign: 'left',
                                fontSize: 12,
                            },
                        },
                    ],
                ],
                theme: 'plain',
            });
            autoTable(doc, {
                head: [['Variant', 'Quantity', 'Price']],
                body: [
                    ...service.variants.map((variant: any) => [
                        variant.name,
                        variant.quantity,
                        variant.price
                    ]),
                ],
                theme: 'striped',
                headStyles: {
                    fillColor: '#343a40',
                },
            });
        }

        autoTable(doc, {
            body: [
                [
                    {
                        content: 'Subtotal:',
                        styles: {
                            halign: 'right',
                        },
                    },
                    {
                        content: 'INR ' + this.roundOff(currentBookingData?.billing.subTotal),
                        styles: {
                            halign: 'right',
                        },
                    },
                ],
                [
                    {
                        content: 'Discount:',
                        styles: {
                            halign: 'right',
                        },
                    },
                    {
                        content: 'INR ' + this.roundOff(currentBookingData?.billing.discount),
                        styles: {
                            halign: 'right',
                        },
                    },
                ],
                [
                    {
                        content: 'Tax Rate: ',
                        styles: {
                            halign: 'right',
                        },
                    },
                    {
                        content: 'INR ' + this.roundOff(currentBookingData?.billing.tax),
                        styles: {
                            halign: 'right',
                        },
                    },
                ],
                [
                    {
                        content: 'Total amount:',
                        styles: {
                            halign: 'right',
                        },
                    },
                    {
                        content: 'INR ' + this.roundOff(currentBookingData?.billing.grandTotal),
                        styles: {
                            halign: 'right',
                        },
                    },
                ],
            ],
            theme: 'plain',
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: 'Terms & notes',
                        styles: {
                            halign: 'left',
                            fontSize: 14,
                        },
                    },
                ],
                [
                    {
                        content:
                            'The mentioned billing is final and non-negotiable. ' +
                            'This bill is auto generated by system and does not require any signature. ' +
                            'Please contact us if you have any query and we will be happy to help you.',
                        styles: {
                            halign: 'left',
                        },
                    },
                ],
            ],
            theme: 'plain',
        });

        autoTable(doc, {
            body: [
                [
                    {
                        content: 'Powered by Shreeva \n shreeva.com',
                        styles: {
                            halign: 'center',
                        },
                    },
                ],
            ],
            theme: 'plain',
        });

        return doc.save(`Invoice_${currentBookingData.id}`);
    }
}