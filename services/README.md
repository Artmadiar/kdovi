# Description of available functions

## Cloud synchronization
Synchronize data from source database tables to cloud. 

### Usage
1. $COMPANY/admin/profile/update (for ICON)
1. sync/holmesplace (Unit4, Exerp)
1. sync/evo (Evo)

### Files: (TODO: create ES6 Class for synchronization)
* syncCloudRow.js
* syncPerson.js
* syncMembership.js
  * syncFinance.js
  * syncUsage.js
* syncProspect.js
* syncCommunication.js
* syncMarketo.js

### Prerequisities:
* comparisonQuery.js - load difference between today and yesterday query
* objectDiff.js - check differences in data in application
* Transformation services
  * transformEvoToCloud.js
  * transformIconToCloud.js
  * transformEVoToCloud.js
* ISODate.js (for Unit4) - translates date format to JS Date
* Configs
  * configs/config.unit4.pt.js
  * configs/config.unit4.es.js
  * configs/config.exerp.js
  * configs/config.evo.js

## Unit4 SalesPersons synchronization
Synchronize Sales persons to model sales_person.

### Files:
* synchronizeSalesConsultants.js (should be renamed to syncSalesPersons.js)

## Logging
* logs data to console or file as promise

### Files:
* logging.js

## MarketoSync - Synchronize data from Cloud to Marketo
1. prepare query statement
1. run synchronizetaion 

### Prerequisities
* libs/MarektoREST.js library

### Query for calucation of amount data to synchronization
```
SELECT 
"cRMMemberClub", COUNT(*), COUNT(CASE WHEN "cRMIsMember"=true THEN 1 END) AS "members", COUNT(CASE WHEN "cRMIsMember"=false THEN 1 END) AS "prospects/exmembers" FROM
((SELECT "marketo"."id" AS "marketoId",
          "person"."name" AS "FirstName",
          "person"."surname" AS "LastName",
          "membership"."membershipId" AS "hPmembernumber",
          "club"."name" AS "cRMMemberClub",
          "club"."id" AS "cRMClubID",
          "region"."name" AS "Country",
          "region"."countryDial" AS "countryDial",
          "region"."marketoPartition" AS "marketoPartition",
          "person"."nationalId" AS "cRMFiscalNumber",
          "person"."email" AS "Email",
          "person"."address" AS "Address",
          "person"."postalCode" AS "PostalCode",
          "person"."city" AS "City",
          "person"."phone" AS "Phone",
          "person"."mobile" AS "MobilePhone",
          DATE("person"."birthDate") AS "DateofBirth",
          DATE_PART('month',"person"."birthDate") AS "birthMonth",
          DATE_PART('year',"person"."birthDate") AS "birthYear",
          EXTRACT(YEAR FROM AGE(NOW(), "person"."birthDate")) AS "cRMAge",
          CASE "person"."sex"='' WHEN TRUE THEN NULL ELSE CASE "person"."sex" WHEN 'F' THEN 'Woman' ELSE 'Men' END
          END AS "cRMGender",
          CASE "person"."sex"='C' WHEN TRUE THEN 'Corporate' ELSE 'Private'
          END AS "cRMPrivateVsCorporate",
          "membership"."status" AS "cRMStatus",
          "membership"."subStatus" AS "cRMSubStatus",
          DATE("memberzone"."lastLoginDate") AS "cRMLastLogin",
          "memberzone"."email" AS "cRMRecoveryEmail",
          "membership"."activeContractType" AS "cRMU4ContractTypeActive",
          CASE "membership"."status"='LOTHER' OR "membership"."status"='LAPS' OR "membership"."status"='LAPSTE' OR "membership"."status"='LAPT' OR "membership"."status"='TRANSFERED' WHEN TRUE THEN FALSE ELSE TRUE END AS "cRMIsMember",
          DATE("membership"."joiningDate") AS "cRMJoiningDate",
          DATE("membership"."lastLiveDate") AS "cRMCreationDatemsi",
          "person"."crm" AS "leadSource",
          GREATEST("usage"."last7days", "usage"."last15days", "usage"."last30days", "usage"."last90days", "usage"."last120days", "usage"."last180days", "usage"."last240days") AS "cRMUsage",
          "usage"."last7days" AS "cRMUsage7days",
          "usage"."last15days" AS "cRMUsage15days",
          "usage"."last30days" AS "cRMUsage30days",
          "usage"."last90days" AS "cRMUsage90days",
          "usage"."last120days" AS "cRMUsage120days",
          "usage"."last180days" AS "cRMUsage180days",
          "usage"."last240days" AS "cRMUsage240days",
          "finance"."paidAmount" AS "cRMPayments",
          "finance"."debtAmount" AS "cRMDebt",
          DATE("membership"."membershipEndDate") AS "cRMMembershipEndDate",
          "membership"."membershipId" AS "cRMMembershipID",
          "membership"."membershipName" AS "cRMMembershipName",
          "membership"."membershipState" AS "cRMMembershipState",
          "membership"."type" AS "cRMTypeofmembership",
          "memberzone"."facebook" AS "cRMFacebook",
          "person"."photo" AS "cRMPhoto",
          "person"."id" AS "cRMID",
          "marketo"."leadWorkflow" AS "cRMLeadWorkflow",
          "marketo"."leadWorkflowDate" AS "cRMLeadWorkflowDate",
          "communication"."email" AS "cRMAllowEmail",
          "communication"."letter" AS "cRMAllowLetter",
          "communication"."phone" AS "cRMAllowPhone",
          "communication"."sms" AS "cRMAllowSMS",
          "membership"."salesStaffName" AS "leadOwnername",
          "membership"."salesStaffName" AS "salesOwnername",
          DATE("membership"."createDate") AS "cRMU4CreationDate",
          "membership"."salesStaffEmail" AS "cRMSalesOwnerEmail",
          "membership"."assignedToEmail" AS "cRMLeadOwnerEmail",
          EXTRACT(YEAR FROM AGE(NOW(), "membership"."lastLiveDate"))*12+EXTRACT(MONTH FROM AGE(NOW(), "membership"."lastLiveDate")) AS "cRMMembershipAgeinMonths",
          EXTRACT(YEAR FROM AGE(NOW(), "membership"."lastLiveDate")) AS "cRMMembershipAgeinYears",
          "region"."marketoSource" AS "leadSource",
          DATE_PART('month',NOW()) AS "currentMonth",
          DATE_PART('year',NOW()) AS "currentYear",
          "marketo"."deleted" AS "cRMDelete"
   FROM "person"
   INNER JOIN "membership" AS "membership" ON ("membership"."personId"="person"."id")
   INNER JOIN "region" AS "region" ON ("person"."regionExternalId"="region"."externalId")
   INNER JOIN "club" AS "club" ON ("membership"."clubExternalId"="club"."externalId" AND "region"."id"="club"."regionId")
   INNER JOIN "communication" AS "communication" ON ("communication"."personId"="person"."id")
   INNER JOIN "finance" AS "finance" ON ("finance"."membershipId"="membership"."id")
   INNER JOIN "usage" AS "usage" ON ("usage"."membershipId"="membership"."id")
   LEFT JOIN "memberzone" AS "memberzone" ON ("memberzone"."membershipId"="membership"."id")
   INNER JOIN "marketo" AS "marketo" ON ("marketo"."membershipId"="membership"."id")
   WHERE ("marketo"."update" = TRUE) AND ((("person"."email" IS NOT NULL AND "person"."email" != '')
           OR ("person"."phone" IS NOT NULL AND "person"."phone" != '' AND "communication"."sms"=TRUE)
           OR ("person"."mobile" IS NOT NULL AND "person"."mobile" != '' AND "communication"."sms"=TRUE)
           AND "membership"."status" IN ('TRANSFERED', 'INACTIVE', 'LOTHER', 'LAPS', 'LAPSTE', 'LAPT'))
          OR ("membership"."status" IN ('ACTIVE', 'TEMPORARYINACTIVE', 'LIVE', 'LIPA', 'LIMP', 'STAFF', 'KID', 'KIDEXTRA', 'KIDFRE', 'FRE', 'EXTRA', 'DEBT', 'DOTHER', 'OTHER', 'COMP'))))
UNION
  (SELECT "marketo"."id" AS "marketoId",
          "person"."name" AS "FirstName",
          "person"."surname" AS "LastName",
          "prospect"."prospectId" AS "hPmembernumber",
          "club"."name" AS "cRMMemberClub",
          "club"."id" AS "cRMClubID",
          "region"."name" AS "Country",
          "region"."countryDial" AS "countryDial",
          "region"."marketoPartition" AS "marketoPartition",
          "person"."nationalId" AS "cRMFiscalNumber",
          "person"."email" AS "Email",
          "person"."address" AS "Address",
          "person"."postalCode" AS "PostalCode",
          "person"."city" AS "City",
          "person"."phone" AS "Phone",
          "person"."mobile" AS "MobilePhone",
          DATE("person"."birthDate") AS "DateofBirth",
          DATE_PART('month', "person"."birthDate") AS "birthMonth",
          DATE_PART('year',"person"."birthDate") AS "birthYear",
          EXTRACT(YEAR FROM AGE(NOW(), "person"."birthDate")) AS "cRMAge", 
          CASE "person"."sex"='' WHEN TRUE THEN NULL ELSE CASE "person"."sex"='F' WHEN TRUE THEN 'Woman' ELSE 'Men' END
          END AS "cRMGender",
          NULL AS "cRMPrivateVsCorporate",
          "prospect"."status" AS "cRMStatus",
          "prospect"."subStatus" AS "cRMSubStatus",
          NULL AS "cRMLastLogin",
          NULL AS "cRMRecoveryEmail",
          NULL AS "cRMContractTypeActive",
          FALSE AS "cRMIsMember",
          DATE(NULL) AS "cRMJoiningDate",
          DATE(NULL) AS "cRMCreationDatemsi",
          person.crm AS "leadSource",
          NULL AS "cRMUsage",
          NULL AS "cRMUsage7days",
          NULL AS "cRMUsage15days",
          NULL AS "cRMUsage30days",
          NULL AS "cRMUsage90days",
          NULL AS "cRMUsage120days",
          NULL AS "cRMUsage180days",
          NULL AS "cRMUsage240days",
          NULL AS "cRMPayments",
          NULL AS "cRMDebt",
          NULL AS "cRMMembershipEndDate",
          NULL AS "cRMMembershipID",
          NULL AS "cRMMembershipName",
          NULL AS "cRMMembershipState",
          NULL AS "cRMTypeofmembership",
          NULL AS "cRMFacebook",
          "person"."photo" AS "cRMPhoto",
          "person"."id" AS "cRMID",
          "marketo"."leadWorkflow" AS "cRMLeadWorkflow",
          DATE("marketo"."leadWorkflowDate") AS "cRMLeadWorkflowDate",
          "communication"."email" AS "cRMAllowEmail",
          "communication"."letter" AS "cRMAllowLetter",
          "communication"."phone" AS "cRMAllowPhone",
          "communication"."sms" AS "cRMAllowSMS",
          "prospect"."salesStaffName" AS "leadOwnername",
          "prospect"."salesStaffName" AS "salesOwnername",
          DATE("prospect"."createDate") AS "cRMU4CreationDate",
          "prospect"."salesStaffEmail" AS "cRMSalesOwnerEmail",
          "prospect"."assignedToEmail" AS "cRMLeadOwnerEmail",
          NULL AS "cRMMembershipAgeinMonths",
          NULL AS "cRMMembershipAgeinYears",
          "region"."marketoSource" AS "leadSource",
          DATE_PART('month',NOW()) AS "currentMonth",
          DATE_PART('year',NOW()) AS "currentYear",
          "marketo"."deleted" AS "cRMDelete"
   FROM "person"
   INNER JOIN "prospect" AS "prospect" ON ("prospect"."personId"="person"."id")
   INNER JOIN "region" AS "region" ON ("person"."regionExternalId"="region"."externalId")
   INNER JOIN "club" AS "club" ON ("prospect"."clubExternalId"="club"."externalId" AND "region"."id"="club"."regionId")
   INNER JOIN "communication" AS "communication" ON ("communication"."personId"="person"."id")
   INNER JOIN "marketo" AS "marketo" ON ("marketo"."prospectId"="prospect"."id")
   WHERE ((("person"."email" IS NOT NULL AND "person"."email" != '') OR ("person"."phone" IS NOT NULL AND "person"."phone" != '' AND "communication"."sms"=TRUE)
        OR ("person"."mobile" IS NOT NULL AND "person"."mobile" != '' AND "communication"."sms"=TRUE)))
     AND ("prospect"."status" IN ('PROSPECT', 'WPROSP', 'DUMP', 'DORMANT', 'DORMCCT', 'TRIAL', 'HOT', 'HOTCCT', 'HOTI', 'WARMCCT', 'MEMBER', 'WARM', 'DUMPCCT', '99999999'))
     AND ("marketo"."update" = TRUE))) as "all"
GROUP BY "cRMMemberClub"
```