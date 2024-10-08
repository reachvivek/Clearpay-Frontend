/**
 * PaymentAdvisoryPortalAPI
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface BillsForDashboardDto { 
    billID?: number;
    isPending?: number;
    isProcessed?: number;
    invoiceNo?: string;
    bankName?: string;
    state?: string;
    lhoName?: string;
    serviceType?: string;
    invoiceYear?: number;
    invoiceMonth?: string;
    dateOfSubmission?: string;
    ackProof?: string;
    invoiceAmountWithGST?: number;
    invoiceAmountPaidNavision?: number;
    attachment?: string;
}