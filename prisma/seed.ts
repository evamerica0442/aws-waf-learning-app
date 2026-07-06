import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ─── UPSERT PILLARS (idempotent) ────────────────────────────────
  const opEx = await upsertPillar('operational-excellence', 'Operational Excellence',
    'The Operational Excellence pillar focuses on running and monitoring systems to deliver business value, and continually improving processes and procedures. Key topics include automating changes, responding to events, and defining standards for success.',
    'settings-gear');
  const security = await upsertPillar('security', 'Security',
    'The Security pillar focuses on protecting information and systems through identity and access management, detective controls, infrastructure protection, data protection, and incident response. Cloud security is a shared responsibility between AWS and the customer.',
    'shield-lock');
  const reliability = await upsertPillar('reliability', 'Reliability',
    'The Reliability pillar focuses on ensuring a workload performs its intended function correctly and consistently when expected to. This includes designing for resilience, testing recovery procedures, and scaling horizontally.',
    'arrows-rotate');
  const perfEfficiency = await upsertPillar('performance-efficiency', 'Performance Efficiency',
    'The Performance Efficiency pillar focuses on using computing resources efficiently to meet system requirements and maintaining that efficiency as demand changes and technologies evolve.',
    'gauge-high');
  const costOptimization = await upsertPillar('cost-optimization', 'Cost Optimization',
    'The Cost Optimization pillar focuses on avoiding unnecessary costs, understanding spending, and using the most appropriate resources to maximize business value. It involves continual evaluation and refinement of your cloud spending.',
    'coins');
  const sustainability = await upsertPillar('sustainability', 'Sustainability',
    'The Sustainability pillar focuses on minimizing the environmental impact of running cloud workloads. It addresses energy efficiency and resource utilization across all components of a workload, from compute and storage to networking and data centers.',
    'leaf');

  const pillars: Record<string, { id: number }> = {
    'operational-excellence': opEx,
    'security': security,
    'reliability': reliability,
    'performance-efficiency': perfEfficiency,
    'cost-optimization': costOptimization,
    'sustainability': sustainability,
  };

  // ─── UPSERT DESIGN PRINCIPLES ────────────────────────────────────
  await upsertDesignPrinciples(pillars);

  // ─── UPSERT USE CASES & EXAMPLES ────────────────────────────────
  await upsertUseCases(pillars);

  // ─── UPSERT QUIZ QUESTIONS ──────────────────────────────────────
  await upsertQuizQuestions(pillars);

  // ─── UPSERT SCENARIOS ───────────────────────────────────────────
  await upsertScenarios(pillars);

  console.log('Seeding completed successfully!');
}

// ─── HELPER: Upsert a pillar ───────────────────────────────────────
async function upsertPillar(slug: string, name: string, summary: string, iconName: string) {
  return prisma.pillar.upsert({
    where: { slug },
    update: { name, summary, iconName },
    create: { slug, name, summary, iconName },
  });
}

// ─── DESIGN PRINCIPLES ─────────────────────────────────────────────
async function upsertDesignPrinciples(pillars: Record<string, { id: number }>) {
  const principles: { slug: string; title: string; description: string }[] = [
    // Operational Excellence
    { slug: 'operational-excellence', title: 'Perform operations as code', description: 'Apply the same rigor and discipline used for application code to your operations environment. Use infrastructure as code (IaC) to define your entire workload, including operational procedures. Treat runbooks and playbooks as code that can be version-controlled, tested, and deployed through CI/CD pipelines.' },
    { slug: 'operational-excellence', title: 'Make frequent, small, reversible changes', description: 'Design your workload to allow updates to be applied frequently and incrementally. Small changes reduce the blast radius of failures and make it easier to roll back if issues occur. Use feature flags, canary deployments, and blue/green deployments to minimize risk.' },
    { slug: 'operational-excellence', title: 'Refine operations procedures frequently', description: 'Continually evolve your operations procedures as you learn from operations events. Use post-incident analysis (post-mortems) to identify improvement opportunities. Regularly review and update runbooks, and validate them through game days and simulations.' },
    { slug: 'operational-excellence', title: 'Anticipate failure', description: 'Perform pre-mortem exercises to identify potential failure modes and mitigate them before they occur. Test failure scenarios through chaos engineering, game days, and fault injection. Design systems that can withstand failures and degrade gracefully.' },
    { slug: 'operational-excellence', title: 'Learn from all operational failures', description: 'Drive improvement through lessons learned from all operational events and failures. Share knowledge across teams through blameless post-mortems, operational reviews, and documentation. Use these insights to improve systems, processes, and procedures.' },
    // Security
    { slug: 'security', title: 'Implement a strong identity foundation', description: 'Implement the principle of least privilege for all identities—human users and machine workloads. Use AWS IAM to centralize identity management, enforce fine-grained permissions, and require strong authentication mechanisms like multi-factor authentication (MFA). Use temporary credentials via IAM roles instead of long-term access keys.' },
    { slug: 'security', title: 'Enable traceability', description: 'Monitor, alert, and audit actions and changes to your environment in real time. Use AWS CloudTrail to record API activity, AWS Config to track resource configuration changes, and Amazon GuardDuty for intelligent threat detection. Integrate logs and events with centralized security information and event management (SIEM) systems.' },
    { slug: 'security', title: 'Apply security at all layers', description: 'Apply defense-in-depth by implementing security controls at every layer—from the edge network to the application and data layers. Use network segmentation, security groups, network ACLs, web application firewalls (WAF), and encryption to create multiple overlapping security controls.' },
    { slug: 'security', title: 'Automate security best practices', description: 'Automate security mechanisms to improve your ability to scale securely and respond to events rapidly. Use AWS Config rules to enforce compliance, AWS Security Hub to aggregate findings, and infrastructure as code to deploy security controls consistently. Automate incident response with Lambda functions.' },
    { slug: 'security', title: 'Protect data in transit and at rest', description: 'Classify your data into sensitivity levels and apply the appropriate encryption and access controls. Use AWS KMS for key management, encrypt data at rest with S3 server-side encryption or EBS encryption, and enforce TLS for data in transit. Implement data lifecycle policies to securely delete data when no longer needed.' },
    // Reliability
    { slug: 'reliability', title: 'Automatically recover from failure', description: 'Monitor key performance indicators (KPIs) and configure automated recovery processes when a threshold is breached. Use automated health checks and auto-remediation to handle failures without human intervention. Design systems that can automatically detect and recover from failures.' },
    { slug: 'reliability', title: 'Test recovery procedures', description: 'Regularly test your disaster recovery and failover procedures to ensure they work as expected. Use game days and chaos engineering to simulate failures and validate recovery paths. Test both component-level failures and full-region failure scenarios.' },
    { slug: 'reliability', title: 'Scale horizontally to increase aggregate system availability', description: 'Replace one large resource with multiple smaller resources to reduce the impact of a single point of failure. Distribute requests across multiple, smaller resources to improve both availability and performance. Use auto scaling to adjust capacity automatically.' },
    { slug: 'reliability', title: 'Stop guessing capacity', description: 'Use monitoring and trending data to understand your capacity needs, and use automated scaling to respond to changes in demand. Provision resources based on actual usage patterns rather than peak predictions. Use auto scaling to add or remove capacity as needed.' },
    { slug: 'reliability', title: 'Manage change through automation', description: 'Use infrastructure as code and automated deployment pipelines to manage changes to your production environment. Changes should be made through automated processes that can be audited, tested, and rolled back if necessary.' },
    // Performance Efficiency
    { slug: 'performance-efficiency', title: 'Democratize advanced technologies', description: 'Consume advanced technologies as services where the expertise is embedded in the service, allowing your team to focus on product differentiation. For example, use Amazon SageMaker for ML, Amazon DynamoDB for NoSQL databases, and Amazon Rekognition for image analysis.' },
    { slug: 'performance-efficiency', title: 'Go global in minutes', description: 'Deploy your workload in multiple AWS Regions around the world to provide lower latency and a better experience for global customers at minimal cost. Use AWS Global Accelerator and Amazon CloudFront to improve performance for users worldwide.' },
    { slug: 'performance-efficiency', title: 'Use serverless architectures', description: 'Remove the need to run and maintain servers for compute and data processing operations. Serverless services like AWS Lambda, Amazon API Gateway, and Amazon DynamoDB automatically scale and you pay only for what you use.' },
    { slug: 'performance-efficiency', title: 'Experiment more often', description: 'Use comparative testing and load testing to evaluate different types of instances, storage, and configurations. Use AWS tools to perform benchmarking and find the optimal configuration for your workload.' },
    { slug: 'performance-efficiency', title: 'Consider mechanical sympathy', description: 'Understand how your application uses cloud resources and select the storage, compute, and database services that best match your workload patterns. Consider trade-offs between compute, storage, memory, and network characteristics.' },
    // Cost Optimization
    { slug: 'cost-optimization', title: 'Implement cloud financial management', description: 'Dedicate time and resources to build a cloud financial management and governance capability. Use AWS Cost Explorer, AWS Budgets, and Cost Allocation Tags to track and manage costs. Establish a Cloud Center of Excellence (CCoE) to drive cost optimization across the organization.' },
    { slug: 'cost-optimization', title: 'Adopt a consumption model', description: 'Pay only for the compute resources you consume and increase or decrease usage depending on requirements. Use Auto Scaling to match capacity with demand. Use serverless services where appropriate to eliminate idle capacity.' },
    { slug: 'cost-optimization', title: 'Measure overall efficiency', description: 'Measure the business output of your workload and the costs associated with delivering it. Use this data to understand the impact of changes and identify opportunities for improvement. Track metrics like cost per transaction, cost per user, or cost per business outcome.' },
    { slug: 'cost-optimization', title: 'Stop spending money on undifferentiated heavy lifting', description: 'Evaluate whether you can use AWS managed services instead of building and operating your own infrastructure. Managed services often provide better performance, reliability, and security at a lower total cost of ownership.' },
    { slug: 'cost-optimization', title: 'Analyze and attribute expenditure', description: 'Use detailed billing reports and cost allocation tags to accurately attribute costs to specific workloads, teams, or projects. This visibility enables informed decisions about resource optimization and budget planning.' },
    // Sustainability
    { slug: 'sustainability', title: 'Understand your impact', description: 'Measure the environmental impact of your cloud workloads using tools like the AWS Customer Carbon Footprint Tool. Model the projected impact and establish key performance indicators (KPIs) to track improvement over time.' },
    { slug: 'sustainability', title: 'Establish sustainability goals', description: 'Set sustainability goals for your cloud workloads and quantify the expected impact. Use these goals to guide architectural decisions and prioritize optimization efforts. Track progress using the carbon footprint tool.' },
    { slug: 'sustainability', title: 'Maximize utilization', description: 'Right-size your compute and database resources to maximize utilization and minimize the environmental impact of running idle or underutilized resources. Use Auto Scaling to match capacity with demand.' },
    { slug: 'sustainability', title: 'Anticipate and adopt new, more efficient hardware and software offerings', description: 'Stay informed about new AWS services, instance types, and features that can improve the efficiency of your workloads. AWS continuously improves the efficiency of its data centers and offers more efficient hardware options like Graviton processors.' },
    { slug: 'sustainability', title: 'Use managed services', description: 'Use AWS managed services to reduce the environmental impact of your workloads. Shared services can achieve higher resource utilization than dedicated services, reducing the overall energy consumption per unit of work.' },
  ];

  for (const dp of principles) {
    const pillar = pillars[dp.slug as keyof typeof pillars];
    const existing = await prisma.designPrinciple.findFirst({
      where: { pillarId: pillar.id, title: dp.title },
    });
    if (!existing) {
      await prisma.designPrinciple.create({
        data: { pillarId: pillar.id, title: dp.title, description: dp.description },
      });
    }
  }
  console.log('  Design Principles: upserted');
}

// ─── USE CASES & EXAMPLES ──────────────────────────────────────────
async function upsertUseCases(pillars: Record<string, { id: number }>) {
  // Delete existing use cases and examples to re-create cleanly
  await prisma.example.deleteMany();
  await prisma.useCase.deleteMany();

  const useCasesData = [
    // Operational Excellence
    { pillarSlug: 'operational-excellence', title: 'Automated Deployment Pipeline', problemStatement: 'A development team is manually deploying application updates to production, leading to inconsistent deployments, human errors, and long deployment windows. They need a repeatable, automated deployment process.', recommendedApproach: 'Implement a CI/CD pipeline using AWS CodePipeline, AWS CodeBuild, and AWS CodeDeploy. Automate building, testing, and deploying code changes through a staged pipeline with automated quality gates. Use infrastructure as code with AWS CloudFormation or Terraform to provision environments. Implement canary deployments to gradually roll out changes and automatically roll back if error rates increase.', awsServicesInvolved: ['AWS CodePipeline', 'AWS CodeBuild', 'AWS CodeDeploy', 'AWS CloudFormation', 'Amazon CloudWatch'], examples: [
      { title: 'CI/CD Pipeline with canary deployments', scenario: 'An e-commerce platform deploys updates multiple times per day. The team uses CodePipeline to orchestrate builds and deployments. New changes are first deployed to a canary fleet receiving 10% of traffic. CloudWatch alarms monitor error rates and latency p99 metrics. If the canary passes health checks for 15 minutes, the deployment rolls forward to 100%. If alarms trigger, the deployment automatically rolls back.', architectureNotes: 'The pipeline consists of Source (CodeCommit/GitHub), Build (CodeBuild), Staging Deploy (CodeDeploy to staging environment), Integration Tests, Canary Deploy (CodeDeploy with 10% traffic), Monitoring Period, and Production Deploy stages. CloudWatch Synthetics monitors the canary URLs. AWS Lambda functions handle the deployment approval and rollback logic.', codeOrConfigSnippet: `{
  "version": 0.2,
  "pipeline": {
    "name": "ecommerce-deploy-pipeline",
    "stages": [
      { "name": "Source", "actions": [{ "actionTypeId": { "category": "Source", "provider": "CodeCommit" }, "configuration": { "RepositoryName": "ecommerce-app", "BranchName": "main" } }] },
      { "name": "Build", "actions": [{ "actionTypeId": { "category": "Build", "provider": "CodeBuild" }, "configuration": { "ProjectName": "ecommerce-build" } }] },
      { "name": "CanaryDeploy", "actions": [{ "actionTypeId": { "category": "Deploy", "provider": "CodeDeploy" }, "configuration": { "ApplicationName": "ecommerce-app", "DeploymentGroupName": "canary", "DeploymentConfig": "CodeDeployDefault.ECSCanary10Percent5Minutes" } }] }
    ]
  }
}` },
      { title: 'Infrastructure as Code with CloudFormation', scenario: 'A financial services company manages multiple environments (dev, staging, prod) across different AWS accounts. They need to ensure consistent infrastructure configuration across all environments.', architectureNotes: 'CloudFormation StackSets are used to deploy infrastructure across multiple accounts and regions. Resource configurations are parameterized using CloudFormation parameters and mapped to environment-specific values in Parameter Store. Change sets allow review of infrastructure changes before execution. Drift detection alerts the team when manual changes are made outside of CloudFormation.', codeOrConfigSnippet: `Parameters:
  Environment:
    Type: String
    AllowedValues: [dev, staging, prod]
  InstanceType:
    Type: String
    Default: t3.medium
Conditions:
  IsProduction: !Equals [!Ref Environment, "prod"]
Resources:
  AutoScalingGroup:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      MinSize: !If [IsProduction, 3, 1]
      MaxSize: !If [IsProduction, 20, 5]
      DesiredCapacity: !If [IsProduction, 3, 1]` },
    ] },
    { pillarSlug: 'operational-excellence', title: 'Event-Driven Incident Response', problemStatement: 'An operations team struggles to respond to infrastructure incidents in a timely manner. Alerts are noisy, often ignored, and there is no standardized process for incident triage and escalation.', recommendedApproach: 'Implement an event-driven incident management system using Amazon EventBridge, AWS Lambda, and AWS Systems Manager. Create automated runbooks that respond to common incident patterns. Use EventBridge rules to filter and prioritize alerts, invoke Lambda functions for automated remediation, and integrate with AWS Systems Manager OpsCenter for manual triage of complex issues.', awsServicesInvolved: ['Amazon EventBridge', 'AWS Lambda', 'AWS Systems Manager', 'Amazon CloudWatch', 'AWS Chatbot'], examples: [
      { title: 'Automated incident response runbook', scenario: 'When an EC2 instance fails its health check, a CloudWatch alarm triggers EventBridge. EventBridge invokes a Lambda function that attaches a new EBS volume snapshot, replaces the instance, and updates the Route53 DNS record. If the automated remediation fails, a ticket is created in OpsCenter for manual review.', architectureNotes: 'The system uses EventBridge rules to capture CloudWatch alarm state changes and ASG lifecycle events. Lambda functions implement the remediation logic with idempotent operations. OpsCenter aggregates operational issues, including those that could not be automatically resolved. Slack notifications are sent through AWS Chatbot to inform the on-call engineer.' },
    ] },
    { pillarSlug: 'operational-excellence', title: 'Observability and Monitoring', problemStatement: 'A SaaS company has limited visibility into application performance and user experience. When issues occur, it takes hours to identify the root cause due to scattered logs and metrics across multiple services.', recommendedApproach: 'Implement a comprehensive observability strategy using Amazon CloudWatch, AWS X-Ray, and centralized logging. Use structured logging with correlation IDs across all services. Create dashboards that provide a single pane of glass for application health, business metrics, and operational KPIs. Set up composite alarms that reduce alert noise.', awsServicesInvolved: ['Amazon CloudWatch', 'AWS X-Ray', 'Amazon OpenSearch Service', 'Amazon Managed Grafana', 'AWS Distro for OpenTelemetry'], examples: [
      { title: 'Distributed tracing with X-Ray', scenario: 'A microservices application experiences intermittent latency spikes. The team uses X-Ray to trace requests across service boundaries, identifying that the authentication service has a connection pool exhaustion issue under load.', architectureNotes: 'X-Ray SDK is instrumented in all microservices to capture traces and segments. Trace data includes HTTP methods, response statuses, and annotations for business context. Service maps visualize dependencies and highlight problematic connections. CloudWatch Contributor Insights identifies the top contributors to errors and latency.' },
    ] },
    // Security
    { pillarSlug: 'security', title: 'IAM Least Privilege Implementation', problemStatement: 'An organization has been granting overly permissive IAM policies to users and services, creating a risk of privilege escalation and data exposure. They need a systematic approach to implement least privilege access.', recommendedApproach: 'Use AWS IAM Access Analyzer to identify unused permissions and generate least-privilege policies based on actual usage. Implement fine-grained policies using conditions (tags, source IP, MFA status) to scope permissions. Use permission boundaries to delegate administration while limiting maximum permissions. Implement a just-in-time (JIT) access system for elevated privileges.', awsServicesInvolved: ['AWS IAM', 'AWS IAM Access Analyzer', 'AWS Organizations', 'AWS SSO', 'AWS CloudTrail'], examples: [
      { title: 'Least-privilege policy for an S3 application', scenario: 'A data analytics application needs read/write access to a specific S3 bucket and read access to a reference dataset. The team creates a narrowly scoped IAM policy that restricts access to only the required buckets and operations.', architectureNotes: 'The policy uses IAM conditions to restrict access to specific S3 buckets and prefixes. Access is further scoped to require requests to originate from the company VPC. CloudTrail logs all S3 API calls for audit purposes. IAM Access Analyzer reviews the policy for unintended public or cross-account access.', codeOrConfigSnippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::reference-data/*",
      "Condition": {
        "StringEquals": { "aws:SourceVpc": "vpc-12345678" }
      }
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::analytics-output/" + "\${aws:userid}/*"  // eslint-disable-line no-template-curly-in-string
    }
  ]
}` },
      { title: 'Cross-account role delegation with AWS Organizations', scenario: 'A company with multiple AWS accounts needs to allow developers in the Development account to read logs from the centralized Logging account.', architectureNotes: 'An IAM role is created in the Logging account with a trust policy that allows the Development account to assume it. The trust policy uses the aws:PrincipalOrgID condition to restrict access to accounts within the organization. In the Development account, developers are granted sts:AssumeRole permission for the logging role.', codeOrConfigSnippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::DEV_ACCOUNT:root" },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": { "aws:PrincipalOrgID": "o-xxxxxxxxxx" }
      }
    }
  ]
}` },
    ] },
    { pillarSlug: 'security', title: 'Web Application Firewall Protection', problemStatement: 'A public-facing web application is vulnerable to common web exploits like SQL injection, cross-site scripting (XSS), and application-layer DDoS attacks. The team needs to implement web application security controls.', recommendedApproach: 'Deploy AWS WAF in front of the application to filter and monitor HTTP requests. Create WAF rules to block common attack patterns using AWS managed rule sets. Implement rate-based rules to mitigate DDoS attacks. Use AWS Shield Advanced for additional DDoS protection. Enable WAF logging and integrate with Security Hub for centralized alerting.', awsServicesInvolved: ['AWS WAF', 'AWS Shield', 'Amazon CloudFront', 'Application Load Balancer', 'AWS Security Hub'], examples: [
      { title: 'WAF rule set for web application security', scenario: 'An e-commerce site deploys AWS WAF on their CloudFront distribution. They enable AWS managed rule groups for SQL injection, XSS, and common bot control. They also create custom rate-based rules to prevent credential stuffing and scraper bots.', architectureNotes: 'WAF is associated with the CloudFront distribution, not the ALB, to filter traffic before it reaches the origin. Managed rule groups provide baseline protection against OWASP Top 10 threats. Custom rate-based rules limit requests from a single IP to 100 requests per 5 minutes. Blocked requests are logged to S3 for analysis.', codeOrConfigSnippet: `{
  "Name": "web-acl-rules",
  "DefaultAction": { "Allow": {} },
  "Rules": [
    {
      "Name": "AWS-AWSManagedRulesCommonRuleSet",
      "Priority": 1,
      "Statement": { "ManagedRuleGroupStatement": { "VendorName": "AWS", "Name": "AWSManagedRulesCommonRuleSet" } },
      "OverrideAction": { "None": {} },
      "VisibilityConfig": { "SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "AWSCommonRules" }
    },
    {
      "Name": "rate-limit-rule",
      "Priority": 2,
      "Statement": {
        "RateBasedStatement": { "Limit": 100, "AggregateKeyType": "IP" }
      },
      "Action": { "Block": {} },
      "VisibilityConfig": { "SampledRequestsEnabled": true, "CloudWatchMetricsEnabled": true, "MetricName": "RateLimit" }
    }
  ]
}` },
    ] },
    { pillarSlug: 'security', title: 'Encryption Key Management with AWS KMS', problemStatement: 'A healthcare organization needs to encrypt sensitive patient data across multiple AWS services while maintaining the ability to audit and control key usage. They need a centralized key management strategy.', recommendedApproach: 'Use AWS KMS to create and manage customer master keys (CMKs) with key policies that enforce separation of duties. Implement automatic key rotation. Use key policies and grants to control access. Integrate with CloudTrail to log all key usage. Use S3 bucket policies that enforce server-side encryption with KMS.', awsServicesInvolved: ['AWS KMS', 'AWS CloudHSM', 'AWS CloudTrail', 'AWS Config', 'Amazon S3'], examples: [
      { title: 'Enforcing encryption with S3 bucket policies', scenario: 'An organization stores sensitive data in S3 and requires all objects to be encrypted at rest using KMS. They use a combination of S3 bucket policies and default encryption to enforce this requirement.', architectureNotes: 'The S3 bucket policy denies any PutObject request that does not include the x-amz-server-side-encryption header with aws:kms value. Default encryption is configured on the bucket as a second layer of defense. KMS key policies restrict key administration to security team members while allowing usage by specific application roles.', codeOrConfigSnippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyIncorrectEncryptionHeader",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::patient-data/*",
      "Condition": {
        "StringNotEquals": { "s3:x-amz-server-side-encryption": "aws:kms" }
      }
    },
    {
      "Sid": "DenyUnencryptedObjectUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::patient-data/*",
      "Condition": {
        "Null": { "s3:x-amz-server-side-encryption": true }
      }
    }
  ]
}` },
    ] },
    { pillarSlug: 'security', title: 'Security Incident Detection and Response', problemStatement: 'A company needs to detect and respond to security threats across their AWS environment in near real-time. They lack visibility into suspicious activities and have no automated response capabilities.', recommendedApproach: 'Deploy Amazon GuardDuty for intelligent threat detection, AWS Security Hub for centralized security findings, and Amazon Detective for security investigations. Set up automated response playbooks using Lambda and EventBridge. Integrate with existing SIEM through AWS Security Finding Format (ASFF) exports.', awsServicesInvolved: ['Amazon GuardDuty', 'AWS Security Hub', 'Amazon Detective', 'AWS Lambda', 'Amazon EventBridge'], examples: [
      { title: 'Automated response to compromised credentials', scenario: 'GuardDuty detects a finding indicating that an IAM user credential is being used from an unusual geographic location. The automated response system disables the access keys, sends a notification to the security team, and creates a security incident ticket.', architectureNotes: 'EventBridge receives GuardDuty findings and routes them based on severity. For critical findings (e.g., compromised credentials), a Lambda function immediately disables the affected IAM access keys and sends alerts via SNS. The Security Hub ingests the finding for centralized visibility. Detective is used for deeper investigation into the root cause.' },
    ] },
    // Reliability
    { pillarSlug: 'reliability', title: 'Highly Available Multi-AZ Architecture', problemStatement: 'A production application is deployed in a single Availability Zone, creating a single point of failure. If that AZ experiences an outage, the entire application becomes unavailable.', recommendedApproach: 'Deploy the application across multiple Availability Zones using an Auto Scaling group with an Application Load Balancer. Use Amazon RDS Multi-AZ for database redundancy. Configure Route53 health checks to route traffic away from unhealthy endpoints. Use S3 cross-region replication for critical data.', awsServicesInvolved: ['Amazon EC2', 'Auto Scaling', 'Elastic Load Balancing', 'Amazon RDS', 'Amazon Route53'], examples: [
      { title: 'Multi-AZ web application deployment', scenario: 'A media streaming service deploys its web tier across three Availability Zones. The ALB distributes traffic across instances in all AZs. RDS Multi-AZ provides automatic failover for the database. If an entire AZ becomes unavailable, traffic is automatically routed to the remaining healthy AZs.', architectureNotes: 'The Auto Scaling group has a minimum of 3 instances (1 per AZ) and scales based on CPU utilization and request count. The ALB performs health checks against the application endpoint every 10 seconds. RDS Multi-AZ maintains a synchronous standby replica in a different AZ, with automatic failover in under 60 seconds. Route53 uses a weighted routing policy with health checks to provide DNS-level failover.', codeOrConfigSnippet: `Resources:
  WebAppASG:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      MinSize: "3"
      MaxSize: "20"
      DesiredCapacity: "3"
      VPCZoneIdentifier:
        - !Ref PublicSubnetAZ1
        - !Ref PublicSubnetAZ2
        - !Ref PublicSubnetAZ3
      TargetGroupARNs: [!Ref ALBTargetGroup]
      HealthCheckType: ELB
      HealthCheckGracePeriod: 300

  RDSDatabase:
    Type: AWS::RDS::DBInstance
    Properties:
      Engine: postgres
      MultiAZ: true
      DBInstanceClass: db.r6g.large
      AllocatedStorage: 100` },
      { title: 'Disaster recovery with cross-region replication', scenario: 'A financial application requires a recovery point objective (RPO) of 15 minutes and a recovery time objective (RTO) of 1 hour. The team implements an active-passive DR strategy using a second AWS Region.', architectureNotes: 'S3 cross-region replication copies critical data to the DR region every 5 minutes. RDS read replicas in the DR region are promoted to primary during a failover. Route53 health checks monitor the primary region and automatically update DNS to point to the DR region when failures are detected. AMI replication ensures EC2 launch templates are available in the DR region.' },
    ] },
    { pillarSlug: 'reliability', title: 'Automated Failure Recovery with Health Checks', problemStatement: 'An application experiences periodic failures (e.g., memory leaks, process crashes) that require manual intervention to restart or replace failed instances, leading to prolonged downtime.', recommendedApproach: 'Implement ELB health checks that automatically deregister unhealthy instances and trigger Auto Scaling to replace them. Configure detailed CloudWatch alarms on key metrics (CPU, memory, disk, application-specific). Use AWS Systems Manager Automation to run custom recovery runbooks.', awsServicesInvolved: ['Elastic Load Balancing', 'Auto Scaling', 'Amazon CloudWatch', 'AWS Systems Manager', 'Amazon EC2'], examples: [
      { title: 'Self-healing application instances', scenario: 'A containerized application occasionally suffers from memory leaks that cause the process to become unresponsive. The ALB health check detects the failure after 3 consecutive failed checks (30 seconds), deregisters the instance, and the Auto Scaling group terminates the unhealthy instance and launches a replacement.', architectureNotes: 'The ALB health check polls the /health endpoint on each instance every 10 seconds. After 3 failed checks, the instance is marked unhealthy and Auto Scaling terminates it. The ASG launches a replacement to maintain the desired capacity. CloudWatch alarms monitor the frequency of instance replacements and alert the operations team if replacements exceed the normal rate.' },
    ] },
    { pillarSlug: 'reliability', title: 'Database High Availability and Backup Strategy', problemStatement: 'A mission-critical database is a single point of failure. The team needs continuous availability, automated backup with point-in-time recovery, and the ability to survive regional failures.', recommendedApproach: 'Use Amazon RDS Multi-AZ for high availability within a region. Enable automated backups with a 35-day retention period. Implement cross-region read replicas for disaster recovery. Use AWS Backup for centralized backup management and compliance reporting.', awsServicesInvolved: ['Amazon RDS', 'AWS Backup', 'Amazon Route53', 'AWS DMS', 'Amazon S3'], examples: [
      { title: 'RDS Multi-AZ with cross-region DR', scenario: 'An e-commerce platform uses RDS PostgreSQL with Multi-AZ for high availability. Automated backups run daily and transaction logs are backed up every 5 minutes, providing point-in-time recovery. A cross-region read replica in us-west-2 serves as the DR target and can be promoted to primary in an emergency.', architectureNotes: 'The primary database runs in us-east-1 with a standby in us-east-1b. Synchronous replication ensures zero data loss during AZ failures. Automated backups are stored in S3 with AES-256 encryption. The cross-region read replica in us-west-2 uses async replication with minimal performance impact. Route53 DNS failover health checks monitor database connectivity.' },
    ] },
    // Performance Efficiency
    { pillarSlug: 'performance-efficiency', title: 'Serverless Event-Driven Architecture', problemStatement: 'A data processing application experiences unpredictable traffic patterns. Provisioning servers for peak capacity leads to high costs during low-usage periods, and manual scaling can\'t keep up with demand spikes.', recommendedApproach: 'Migrate to a serverless architecture using AWS Lambda for compute, Amazon API Gateway for the API layer, and Amazon DynamoDB or Aurora Serverless for the database. Use event-driven patterns with Amazon SQS, SNS, and EventBridge to decouple services and enable independent scaling.', awsServicesInvolved: ['AWS Lambda', 'Amazon API Gateway', 'Amazon DynamoDB', 'Amazon SQS', 'Amazon EventBridge'], examples: [
      { title: 'Serverless image processing pipeline', scenario: 'A social media application allows users to upload images that need to be resized, filtered, and watermarked. Traffic spikes are unpredictable—sometimes 10 uploads/minute, sometimes 10,000/minute. A serverless pipeline handles this automatically.', architectureNotes: 'Users upload images to S3, which triggers a Lambda function for initial validation and metadata extraction. The function sends a message to SQS for asynchronous processing. Another Lambda function (scaled automatically based on queue depth) processes the image (resize, filter, watermark) and stores the result in a processed S3 bucket. DynamoDB tracks the processing status.', codeOrConfigSnippet: `const AWS = require('aws-sdk');
const sharp = require('sharp');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/+/g, ' '));

    // Get the original image
    const image = await s3.getObject({ Bucket: bucket, Key: key }).promise();

    // Resize and process
    const resized = await sharp(image.Body)
      .resize(800, 800, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Save processed image
    await s3.putObject({
      Bucket: process.env.PROCESSED_BUCKET,
      Key: key.replace('uploads/', 'processed/'),
      Body: resized,
      ContentType: 'image/jpeg'
    }).promise();
  }
};` },
    ] },
    { pillarSlug: 'performance-efficiency', title: 'Content Delivery Optimization with CloudFront', problemStatement: 'A global media company\'s website loads slowly for users in distant geographic regions due to high latency to the origin servers. They need to improve the global user experience.', recommendedApproach: 'Deploy Amazon CloudFront as a content delivery network (CDN) to cache static and dynamic content at edge locations worldwide. Use origin shielding to reduce load on the origin. Optimize cache behaviors with appropriate TTLs and compression. Use Lambda@Edge for custom logic at the edge.', awsServicesInvolved: ['Amazon CloudFront', 'AWS Global Accelerator', 'AWS WAF', 'Lambda@Edge', 'Amazon S3'], examples: [
      { title: 'Global CDN with dynamic content optimization', scenario: 'A news website serves readers from over 100 countries. Static assets (images, CSS, JS) are cached at CloudFront edge locations for fast loading. Dynamic content (personalized news feeds) is accelerated using origin fetch optimization and keep-alive connections.', architectureNotes: 'CloudFront distributes content through 400+ Points of Presence globally. Static assets have long TTLs (7 days) with versioned URLs for instant cache invalidation. Dynamic content uses shorter TTLs (60 seconds) with cookie-based forwarding for personalization. Origin Shield in the primary region reduces the number of requests to the origin server.' },
    ] },
    { pillarSlug: 'performance-efficiency', title: 'Performance Monitoring and Optimization', problemStatement: 'An application\'s performance has degraded over time without clear visibility into what caused the regression. The team needs to continuously monitor performance and identify optimization opportunities.', recommendedApproach: 'Implement end-to-end performance monitoring using CloudWatch Synthetics (canaries), AWS X-Ray for distributed tracing, and RDS Performance Insights for database optimization. Use Compute Optimizer for instance type recommendations. Regularly review and rightsize resources.', awsServicesInvolved: ['Amazon CloudWatch', 'AWS X-Ray', 'AWS Compute Optimizer', 'RDS Performance Insights', 'AWS Trusted Advisor'], examples: [
      { title: 'Performance optimization with Compute Optimizer', scenario: 'A team notices their EC2 instances have low CPU utilization (average 15%) but high memory usage (average 85%). Compute Optimizer recommends switching from compute-optimized (c5) to memory-optimized (r5) instances, reducing costs by 30% while improving performance.', architectureNotes: 'AWS Compute Optimizer analyzes historical utilization metrics and recommends instance type changes. RDS Performance Insights helps identify slow queries and database bottlenecks. X-Ray traces end-to-end requests to identify which service in the architecture is causing latency spikes.' },
    ] },
    // Cost Optimization
    { pillarSlug: 'cost-optimization', title: 'Rightsizing and Reserved Instance Optimization', problemStatement: 'An organization is running EC2 instances with significant waste due to over-provisioning and on-demand pricing. They need to reduce compute costs without impacting performance.', recommendedApproach: 'Use AWS Compute Optimizer to identify rightsizing opportunities and purchase Reserved Instances or Savings Plans for baseline capacity. Implement Auto Scaling to dynamically match capacity with demand. Use Spot Instances for fault-tolerant and flexible workloads.', awsServicesInvolved: ['AWS Cost Explorer', 'AWS Compute Optimizer', 'AWS Savings Plans', 'Amazon EC2', 'Auto Scaling'], examples: [
      { title: 'EC2 rightsizing with Savings Plans', scenario: 'A data analytics company runs 50 EC2 instances for batch processing. Analysis using Compute Optimizer shows that 30 instances are over-provisioned (running larger instance types than needed) and the workload runs 24/7. By rightsizing and purchasing 3-year Convertible Savings Plans, they reduce compute costs by 52%.', architectureNotes: 'Compute Optimizer analyzes 14 days of utilization data and recommends specific instance family and size changes. Cost Explorer shows historical usage patterns to determine the optimal Savings Plan commitment. The team rightsizes over-provisioned instances first, then purchases a 3-year Convertible Savings Plan covering 80% of baseline usage. Spot Instances handle the remaining 20% of flexible batch jobs.', codeOrConfigSnippet: `# Example AWS Budgets configuration for cost tracking
Budgets:
  MonthlyComputeBudget:
    Type: "AWS::Budgets::Budget"
    Properties:
      Budget:
        BudgetName: "Monthly Compute Spend"
        BudgetLimit:
          Amount: 50000
          Unit: USD
        TimeUnit: MONTHLY
        BudgetType: COST
        CostFilters:
          Service:
            - "AmazonEC2"
      NotificationsWithSubscribers:
        - Notification:
            NotificationType: ACTUAL
            ComparisonOperator: GREATER_THAN
            Threshold: 80
          Subscribers:
            - SubscriptionType: EMAIL
              Address: "finops@example.com"` },
      { title: 'Spot Instance bursting for batch processing', scenario: 'A video transcoding pipeline processes large batches of videos. The workload is fault-tolerant and can be interrupted. By using Spot Instances, the team reduces compute costs by 70% compared to On-Demand pricing.', architectureNotes: 'The pipeline uses a mix of Spot Instances (80%) and On-Demand Instances (20%). When Spot Instances are interrupted, the work is redistributed to remaining instances or queued for later processing. Spot Instance diversification across multiple instance types and pools improves availability. The batch processing system uses SQS for work distribution and can handle interruptions gracefully.' },
    ] },
    { pillarSlug: 'cost-optimization', title: 'Storage Cost Optimization', problemStatement: 'A company stores large volumes of data in S3 with no lifecycle management. Old data is never transitioned to cheaper storage tiers or deleted, resulting in escalating storage costs.', recommendedApproach: 'Implement S3 lifecycle policies to automatically transition objects to lower-cost storage tiers (S3 Infrequent Access, S3 Glacier, S3 Glacier Deep Archive) based on age and access patterns. Use S3 Intelligent-Tiering for unknown or changing access patterns. Enable S3 Storage Class Analysis to identify optimal storage tiers.', awsServicesInvolved: ['Amazon S3', 'S3 Intelligent-Tiering', 'S3 Glacier', 'AWS Cost Explorer', 'S3 Storage Lens'], examples: [
      { title: 'S3 lifecycle policy implementation', scenario: 'A media archive stores video files starting at 10TB and growing at 1TB/month. Access patterns show that files are frequently accessed for 30 days, occasionally accessed for 90 days, rarely accessed after 90 days, and almost never after 365 days.', architectureNotes: 'S3 lifecycle rules automatically transition objects: after 30 days to S3 Standard-IA, after 90 days to S3 Glacier Instant Retrieval, after 365 days to S3 Glacier Deep Archive, and delete after 2,550 days (7 years). S3 Storage Lens provides organization-wide visibility into storage usage and costs. This strategy reduces storage costs by approximately 60%.', codeOrConfigSnippet: `<LifecycleConfiguration>
  <Rule>
    <ID>Transition and Expiration Rule</ID>
    <Filter><Prefix>media-archive/</Prefix></Filter>
    <Status>Enabled</Status>
    <Transitions>
      <Transition>
        <Days>30</Days>
        <StorageClass>STANDARD_IA</StorageClass>
      </Transition>
      <Transition>
        <Days>90</Days>
        <StorageClass>GLACIER_INSTANT_RETRIEVAL</StorageClass>
      </Transition>
      <Transition>
        <Days>365</Days>
        <StorageClass>DEEP_ARCHIVE</StorageClass>
      </Transition>
    </Transitions>
    <Expiration>
      <Days>2550</Days>
    </Expiration>
  </Rule>
</LifecycleConfiguration>` },
    ] },
    { pillarSlug: 'cost-optimization', title: 'Cost Visibility and Governance', problemStatement: 'A growing organization lacks visibility into which teams and projects are driving cloud costs. Without cost attribution, they cannot identify optimization opportunities or enforce budget accountability.', recommendedApproach: 'Implement a comprehensive cost governance framework using AWS Organizations, Cost Allocation Tags, AWS Budgets, and AWS Cost Explorer. Create a tagging strategy that maps costs to teams, environments, and projects. Set up budget alerts and automated actions for cost anomalies.', awsServicesInvolved: ['AWS Cost Explorer', 'AWS Budgets', 'AWS Organizations', 'AWS Trusted Advisor', 'AWS License Manager'], examples: [
      { title: 'Multi-account cost governance with tagging', scenario: 'An enterprise with 20+ AWS accounts needs to track costs at the project and team level. They implement a mandatory tagging strategy enforced by AWS Config rules and use Cost Explorer reports for chargeback.', architectureNotes: 'AWS Organizations consolidates billing across all accounts. Cost Allocation Tags (both AWS-generated and user-defined) categorize resources by CostCenter, Project, Environment, and Team. AWS Budgets generate alerts when spending exceeds 80% and 100% of the budget. AWS Config rules enforce that all resources have required tags, automatically flagging non-compliant resources.' },
    ] },
    // Sustainability
    { pillarSlug: 'sustainability', title: 'Compute Optimization with Graviton Processors', problemStatement: 'A company wants to reduce the environmental impact of their compute-intensive workloads. Current x86-based instances consume significant energy and the team wants to leverage more efficient hardware.', recommendedApproach: 'Migrate workloads to AWS Graviton-based EC2 instances (powered by Arm processors), which offer up to 60% better energy efficiency compared to comparable x86 instances. Use Graviton2 and Graviton3 processors for general-purpose, compute-optimized, and memory-optimized workloads.', awsServicesInvolved: ['Amazon EC2 (Graviton)', 'AWS Lambda (Graviton)', 'Amazon ECS (Graviton)', 'Amazon RDS (Graviton)', 'AWS Compute Optimizer'], examples: [
      { title: 'Migrating web servers to Graviton instances', scenario: 'A SaaS company runs 100 web servers on m5.xlarge instances. By migrating to Graviton-based m7g.xlarge instances, they achieve 40% better performance per watt and reduce their compute carbon footprint by 30%.', architectureNotes: 'The migration involves building new Amazon Machine Images (AMIs) with Arm-based binaries. The existing Auto Scaling group is updated to use the new launch template with Graviton instance types. A blue/green deployment validates that all application binaries and dependencies are compatible with the Arm architecture. AWS Compute Optimizer confirms the new instance type is optimally sized.' },
    ] },
    { pillarSlug: 'sustainability', title: 'Data Lifecycle and Storage Optimization', problemStatement: 'An organization stores large volumes of data indefinitely with no data lifecycle management. Inefficient storage contributes to unnecessary energy consumption in data centers.', recommendedApproach: 'Implement data lifecycle management to delete or archive data that is no longer needed. Use S3 Intelligent-Tiering for automatic cost savings. Compress and deduplicate data before storage. Use EBS snapshots and AMI lifecycle management to clean up stale resources.', awsServicesInvolved: ['Amazon S3', 'S3 Lifecycle', 'Amazon EBS', 'AWS Backup', 'Amazon ECR'], examples: [
      { title: 'EBS snapshot lifecycle optimization', scenario: 'A development team creates daily EBS snapshots for 500 EC2 instances but never cleans up old snapshots. After 2 years, they have accumulated over 365,000 snapshots, many of which are unnecessary. Implementing a snapshot lifecycle policy reduces storage by 80%.', architectureNotes: 'Using Amazon Data Lifecycle Manager (DLM), the team creates policies that retain daily snapshots for 7 days, weekly snapshots for 4 weeks, and monthly snapshots for 12 months. Old snapshots are automatically deleted. This reduces both costs and the energy required to store redundant backup data.' },
    ] },
    { pillarSlug: 'sustainability', title: 'Optimizing Code and Architecture for Sustainability', problemStatement: 'An application requires excessive compute resources to process workloads due to inefficient code and architecture patterns. Improvements can reduce both cost and environmental impact.', recommendedApproach: 'Optimize application code to be more efficient, reducing CPU cycles and memory usage per transaction. Use caching strategies (ElastiCache, CloudFront) to reduce redundant processing. Implement asynchronous processing with SQS to smooth out resource usage. Use serverless services that automatically scale down to zero when not in use.', awsServicesInvolved: ['AWS Lambda', 'Amazon ElastiCache', 'Amazon CloudFront', 'Amazon SQS', 'AWS Compute Optimizer'], examples: [
      { title: 'Serverless data processing pipeline', scenario: 'A batch ETL job that runs on a large EC2 instance 24/7 is migrated to an event-driven serverless architecture using Lambda and SQS. The new architecture only consumes resources when there is data to process, reducing compute time by 80%.', architectureNotes: 'The EC2-based ETL job running 24/7 is replaced with Lambda functions triggered by S3 events. Data is processed in smaller, parallel batches. The serverless pipeline scales to zero when no data is available, and scales up to handle peak loads without idle capacity. This reduces both costs and the environmental footprint of the workload.' },
    ] },
  ];

  for (const uc of useCasesData) {
    const pillar = pillars[uc.pillarSlug as keyof typeof pillars];
    const created = await prisma.useCase.create({
      data: {
        pillarId: pillar.id,
        title: uc.title,
        problemStatement: uc.problemStatement,
        recommendedApproach: uc.recommendedApproach,
        awsServicesInvolved: uc.awsServicesInvolved,
        examples: {
          create: uc.examples.map((ex: any) => ({
            title: ex.title,
            scenario: ex.scenario,
            architectureNotes: ex.architectureNotes,
            codeOrConfigSnippet: ex.codeOrConfigSnippet || null,
            diagramUrl: ex.diagramUrl || null,
          })),
        },
      },
    });
  }
  console.log('  Use Cases & Examples: re-created');
}

// ─── QUIZ QUESTIONS ────────────────────────────────────────────────
async function upsertQuizQuestions(pillars: Record<string, { id: number }>) {
  await prisma.quizQuestion.deleteMany();

  const questions: { slug: string; question: string; options: string[]; correctAnswerIndex: number; explanation: string }[] = [
    { slug: 'operational-excellence', question: 'Which design principle emphasizes applying the same rigor to operations as you do to application code?', options: ['Anticipate failure', 'Perform operations as code', 'Make frequent, small, reversible changes', 'Learn from all operational failures'], correctAnswerIndex: 1, explanation: 'Performing operations as code means using the same development practices (version control, testing, CI/CD) for operational procedures like runbooks, infrastructure definitions, and configuration.' },
    { slug: 'operational-excellence', question: 'What is the primary benefit of making frequent, small, reversible changes?', options: ['Faster feature delivery', 'Reduced blast radius of failures', 'Lower infrastructure costs', 'Improved security posture'], correctAnswerIndex: 1, explanation: 'Small, frequent changes limit the blast radius of failures because each change is small, easy to understand, and quick to roll back if needed.' },
    { slug: 'security', question: 'Which AWS service provides intelligent threat detection by analyzing AWS API activity and network traffic?', options: ['AWS WAF', 'Amazon GuardDuty', 'AWS Shield', 'AWS Config'], correctAnswerIndex: 1, explanation: 'Amazon GuardDuty is a threat detection service that continuously monitors for malicious activity and unauthorized behavior using machine learning and threat intelligence.' },
    { slug: 'security', question: 'What is the principle of "least privilege" in IAM?', options: ['Granting all users administrative access', 'Providing only the permissions necessary to perform a task', 'Using the root account for daily operations', 'Allowing all traffic from the internet'], correctAnswerIndex: 1, explanation: 'Least privilege means granting only the minimum permissions needed to perform a specific job function, reducing the risk of unauthorized access or accidental data exposure.' },
    { slug: 'reliability', question: 'What is the primary benefit of deploying across multiple Availability Zones?', options: ['Lower latency for all users', 'Protection against single-AZ failures', 'Reduced compute costs', 'Simplified network architecture'], correctAnswerIndex: 1, explanation: 'Multi-AZ deployments eliminate single points of failure at the AZ level. If one AZ experiences an outage, traffic is routed to the remaining healthy AZs.' },
    { slug: 'reliability', question: 'What does RDS Multi-AZ provide?', options: ['Read replicas for scaling reads', 'Synchronous standby for automatic failover', 'Cross-region disaster recovery', 'Automated schema migration'], correctAnswerIndex: 1, explanation: 'RDS Multi-AZ provides a synchronous standby replica in a different AZ with automatic failover, ensuring database availability during AZ-level failures.' },
    { slug: 'performance-efficiency', question: 'Which design principle emphasizes using managed services that embed technical expertise?', options: ['Go global in minutes', 'Democratize advanced technologies', 'Use serverless architectures', 'Experiment more often'], correctAnswerIndex: 1, explanation: 'Democratizing advanced technologies means using managed services (like SageMaker, Rekognition, DynamoDB) that embed AWS expertise, allowing your team to focus on building differentiated features.' },
    { slug: 'performance-efficiency', question: 'What is the key benefit of serverless architectures?', options: ['More control over underlying servers', 'Automatic scaling and pay-per-use pricing', 'Better for long-running batch jobs', 'Simpler security model'], correctAnswerIndex: 1, explanation: 'Serverless architectures automatically scale with traffic and charge only for actual usage, eliminating the need to provision and manage servers.' },
    { slug: 'cost-optimization', question: 'Which AWS service helps you automatically transition data to lower-cost storage tiers based on age?', options: ['S3 Versioning', 'S3 Lifecycle Policies', 'S3 Replication', 'S3 Object Lock'], correctAnswerIndex: 1, explanation: 'S3 Lifecycle Policies enable automatic transition of objects to cheaper storage classes (like S3 IA, Glacier, Deep Archive) based on configurable age and access rules.' },
    { slug: 'cost-optimization', question: 'What pricing model offers the largest discount for steady-state EC2 usage?', options: ['On-Demand', 'Spot Instances', 'Savings Plans (3-year)', 'Dedicated Hosts'], correctAnswerIndex: 2, explanation: '3-year Savings Plans or Reserved Instances offer the deepest discounts (up to 72%) for predictable, steady-state workloads, compared to On-Demand pricing.' },
    { slug: 'sustainability', question: 'Which AWS tool helps you measure the environmental impact of your cloud workloads?', options: ['AWS Trusted Advisor', 'AWS Customer Carbon Footprint Tool', 'AWS Cost Explorer', 'AWS Compute Optimizer'], correctAnswerIndex: 1, explanation: 'The AWS Customer Carbon Footprint Tool provides visibility into the carbon emissions associated with your AWS usage, helping you track and reduce your environmental impact.' },
    { slug: 'sustainability', question: 'What is a key benefit of AWS Graviton processors for sustainability?', options: ['Higher clock speeds', 'Better energy efficiency per watt', 'More vCPUs per instance', 'Lower memory latency'], correctAnswerIndex: 1, explanation: 'AWS Graviton processors deliver up to 60% better energy efficiency compared to comparable x86 instances, reducing the environmental impact of compute workloads.' },
  ];

  for (const q of questions) {
    const pillar = pillars[q.slug as keyof typeof pillars];
    await prisma.quizQuestion.create({
      data: {
        pillarId: pillar.id,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation,
      },
    });
  }
  console.log('  Quiz Questions: re-created');
}

// ─── SCENARIOS ─────────────────────────────────────────────────────
async function upsertScenarios(pillars: Record<string, { id: number }>) {
  // Idempotent: skip scenarios that already exist by title.
  // This preserves UserScenarioAttempt rows (user progress) on re-runs.
  // Only new scenarios in the seed data will be inserted.

  const opEx = pillars['operational-excellence'];
  const security = pillars['security'];
  const reliability = pillars['reliability'];
  const perfEfficiency = pillars['performance-efficiency'];
  const costOptimization = pillars['cost-optimization'];
  const sustainability = pillars['sustainability'];

  // ── SINGLE-PILLAR SCENARIOS ──────────────────────────────────────

  // Operational Excellence (5 scenarios)
  const opExScenarios = [
    {
      title: 'Deployment Pipeline Failure',
      scenarioText: 'Your team\'s CI/CD pipeline has been failing intermittently for the past week. The pipeline runs tests, builds a Docker image, and deploys to ECS. Failures occur at random stages, and the team has started bypassing the pipeline by manually SSH-ing into production instances to apply hotfixes. Your CTO is concerned about audit compliance and wants a solution that restores confidence in the deployment process. What approach would you recommend?',
      type: 'open_ended',
      difficulty: 'intermediate',
      modelAnswer: 'First, stop the manual hotfix practice immediately — it creates configuration drift and security risks. Investigate the pipeline failures by examining CloudWatch logs for each stage, checking for resource constraints (e.g., CodeBuild timeout or disk space), and reviewing recent changes to the pipeline configuration or application code. Implement proper error handling and notifications in the pipeline. Add a manual approval gate before production deployment. Consider implementing canary deployments so that if a deployment fails, only a small percentage of traffic is affected. Document the incident and the resolution in a post-mortem to prevent recurrence. This follows the "Learn from all operational failures" and "Make frequent, small, reversible changes" design principles.',
    },
    {
      title: 'Runbook Review Gap',
      scenarioText: 'During a recent security incident, your on-call engineer spent 45 minutes searching through wikis and Slack messages to find the correct runbook for responding to a compromised IAM key. When they finally found it, the runbook was six months out of date and referenced EC2 instance IDs that no longer existed. How would you prevent this from happening again?',
      type: 'multiple_choice',
      difficulty: 'beginner',
      options: [
        { text: 'Store runbooks as code in a Git repository, review them quarterly, and test them during game days', isCorrect: true, explanation: 'Correct! Treating runbooks as code (part of "Perform operations as code") means they are version-controlled, reviewed in pull requests, and tested regularly. Game days validate that the procedures actually work.' },
        { text: 'Create a single large PDF document with all runbooks and email it to the team monthly', isCorrect: false, explanation: 'A static PDF is not version-controlled, cannot be updated collaboratively, and email is not a reliable distribution mechanism. This approach does not scale and will quickly become outdated.' },
        { text: 'Assign one person to be the "runbook keeper" who updates them whenever they remember', isCorrect: false, explanation: 'Relying on a single person creates a bus-factor risk and lacks the rigor of code review. Runbooks should be treated with the same discipline as application code.' },
        { text: 'Use AWS Systems Manager Automation documents as runbooks and trigger them from EventBridge', isCorrect: false, explanation: 'While Systems Manager Automation is a good tool for automated remediation, this answer misses the broader point about keeping runbooks current and testing them. Automation is part of the solution, not the whole solution.' },
      ],
    },
    {
      title: 'Post-Incident Improvement',
      scenarioText: 'After a major outage that took down your e-commerce site for 2 hours, your team conducted a post-mortem. The root cause was a misconfigured database connection pool that exhausted under load. The team identified five action items, but three months later, none of them have been completed. The same type of incident could happen again. What cultural and process changes would you recommend?',
      type: 'open_ended',
      difficulty: 'advanced',
      modelAnswer: 'This is a classic failure of operational discipline. Recommended changes: (1) Treat post-mortem action items with the same priority as feature work — assign owners, set deadlines, and track in the same backlog. (2) Implement a blameless post-mortem culture so engineers feel safe raising issues without fear of punishment. (3) Use automation to prevent recurrence — for example, add a CloudWatch alarm on database connection utilization and an AWS Config rule that checks connection pool settings. (4) Schedule regular "game days" to test failure scenarios proactively. (5) Have a periodic review of outstanding operational improvements. This follows the "Learn from all operational failures" and "Refine operations procedures frequently" design principles.',
    },
    {
      title: 'Change Management Without Automation',
      scenarioText: 'Your organization currently requires a Change Advisory Board (CAB) to approve all production changes. The CAB meets once per week, meaning urgent fixes face a 7-day delay. Developers are frustrated and have started making changes outside of the process. How would you modernize this approach using AWS best practices?',
      type: 'multiple_choice',
      difficulty: 'intermediate',
      options: [
        { text: 'Implement automated deployments with canary releases and automatic rollback, reducing the need for manual CAB approval for low-risk changes', isCorrect: true, explanation: 'Correct! The "Make frequent, small, reversible changes" principle means you can reduce manual gates by automating safety mechanisms. Canary deployments and auto-rollback provide safety without slowing down delivery.' },
        { text: 'Keep the CAB process but meet daily instead of weekly', isCorrect: false, explanation: 'Meeting daily still introduces delay and doesn\'t scale. The goal should be to reduce the need for human approval gates through automation, not to optimize the manual process.' },
        { text: 'Eliminate all change control processes and let developers deploy whenever they want', isCorrect: false, explanation: 'Eliminating all controls is reckless. The right approach is to replace manual controls with automated safety mechanisms, not to remove controls entirely.' },
        { text: 'Require developers to submit changes 2 weeks in advance for better planning', isCorrect: false, explanation: 'Longer lead times would make the problem worse, not better. The Well-Architected Framework advocates for frequent, small changes, not batching them up weeks in advance.' },
      ],
    },
    {
      title: 'Monitoring Blind Spots',
      scenarioText: 'Your application has been experiencing increased error rates for the past month, but your monitoring didn\'t catch it. A customer complained on social media before your team became aware. Upon investigation, you discover that your CloudWatch dashboards only track CPU and memory utilization — not application-level metrics like error rates, latency percentiles, or business metrics like checkout completion rate. How would you redesign your observability strategy?',
      type: 'open_ended',
      difficulty: 'beginner',
      modelAnswer: 'Implement a three-pillar observability strategy: (1) Logs — use structured logging with correlation IDs across all services, centralized in CloudWatch Logs or OpenSearch Service. (2) Metrics — track application-level metrics (error rate, p50/p99 latency, request count) using CloudWatch custom metrics or embedded metric format. Also track business metrics (checkout completion, user signups). (3) Traces — use AWS X-Ray for distributed tracing to identify which service is causing failures. Set up composite CloudWatch alarms that alert on application-level signals, not just infrastructure metrics. Create a single-pane-of-glass dashboard. This follows the "Anticipate failure" design principle by detecting issues before customers notice.',
    },
  ];

  // Security (5 scenarios)
  const securityScenarios = [
    {
      title: 'S3 Bucket Exposure',
      scenarioText: 'You receive an alert from AWS Security Hub that an S3 bucket containing customer PII data has been publicly accessible for 3 days. The bucket was created by a developer who needed to share test data with an external partner. How would you remediate this and prevent it from happening again?',
      type: 'multiple_choice',
      difficulty: 'beginner',
      options: [
        { text: 'Immediately make the bucket private, rotate any exposed credentials, and implement S3 Block Public Access at the account level with a service control policy', isCorrect: true, explanation: 'Correct! S3 Block Public Access at the account level prevents any bucket from being made public, regardless of who creates it. A service control policy (SCP) in AWS Organizations makes this enforceable across all accounts.' },
        { text: 'Send an email to the team reminding them not to make buckets public', isCorrect: false, explanation: 'Relying on manual compliance through email reminders is ineffective. The "Automate security best practices" principle means you should enforce controls programmatically, not through education alone.' },
        { text: 'Delete the bucket and all its contents immediately', isCorrect: false, explanation: 'Deleting evidence before investigating is destructive. You need to understand the scope of exposure first — who accessed the data, what data was exposed, and whether there are legal notification requirements.' },
        { text: 'Create a new IAM policy that denies s3:PutBucketAcl and apply it to all users', isCorrect: false, explanation: 'While this helps, it doesn\'t prevent public access through bucket policies or object ACLs. S3 Block Public Access is the comprehensive solution that covers all avenues of public exposure.' },
      ],
    },
    {
      title: 'Cross-Account Access Design',
      scenarioText: 'Your company has a centralized security team that needs read-only access to CloudTrail logs in 15 different AWS accounts. Currently, each account has a long-term IAM access key shared via a password manager. The security team rotates these keys manually every 90 days. What\'s the better approach?',
      type: 'open_ended',
      difficulty: 'intermediate',
      modelAnswer: 'Use IAM roles with cross-account trust relationships instead of long-term access keys. In each member account, create an IAM role with a trust policy that allows the security team\'s account to assume it. Use the aws:PrincipalOrgID condition to restrict access to accounts within your AWS Organization. The security team uses AWS SSO or IAM Identity Center to assume these roles with temporary credentials. This follows the "Implement a strong identity foundation" principle — use temporary credentials, centralize identity management, and apply least privilege. CloudTrail logs all role assumption events for audit.',
    },
    {
      title: 'Encryption Strategy Decision',
      scenarioText: 'Your company is migrating a healthcare application to AWS that must comply with HIPAA. The application processes patient records and stores them in S3, RDS, and EBS volumes. You need to design an encryption strategy. Which approach best follows AWS security best practices?',
      type: 'multiple_choice',
      difficulty: 'intermediate',
      options: [
        { text: 'Enable encryption at rest for all services using AWS KMS with customer-managed keys, enforce TLS for data in transit, and use S3 bucket policies to require encryption', isCorrect: true, explanation: 'Correct! This follows "Protect data in transit and at rest" by encrypting everywhere. Customer-managed KMS keys give you control over key rotation and access auditing. S3 bucket policies that deny unencrypted uploads enforce the policy at the API level.' },
        { text: 'Encrypt only the RDS database since that\'s where the primary data lives', isCorrect: false, explanation: 'Encrypting only one service leaves data exposed in other locations. Defense in depth requires encryption at every layer — S3 for backups and archives, EBS for compute, and RDS for the database.' },
        { text: 'Use a third-party encryption solution for maximum security', isCorrect: false, explanation: 'AWS KMS is HIPAA-eligible and integrates natively with AWS services. Adding a third-party solution adds complexity without necessarily improving security. AWS\'s shared responsibility model means AWS handles the infrastructure security.' },
        { text: 'Encrypt everything with the same KMS key for simplicity', isCorrect: false, explanation: 'Using a single key for everything violates least privilege. Different workloads and data classifications should use different keys, with key policies that restrict which principals and services can use each key.' },
      ],
    },
    {
      title: 'Incident Response Automation',
      scenarioText: 'Your security team is overwhelmed by the volume of GuardDuty findings. Most are low-severity, but critical findings like "UnauthorizedAccess:IAMUser/MaliciousIPCaller" require immediate action. Currently, the team manually reviews every finding, and critical ones sometimes sit for hours before being addressed. How would you automate this?',
      type: 'open_ended',
      difficulty: 'advanced',
      modelAnswer: 'Implement a tiered automated response system: (1) Use EventBridge rules to route GuardDuty findings based on severity. (2) For critical findings (e.g., compromised credentials), trigger a Lambda function that immediately disables the affected IAM access keys, sends an SNS notification to the security team, and creates a ticket in the incident management system. (3) For medium findings, create a Security Hub insight and send a daily digest. (4) For low findings, log them for weekly review. (5) Use AWS Security Hub to aggregate findings across all accounts. (6) Periodically review the automated responses and refine them based on lessons learned. This follows "Automate security best practices" and "Enable traceability."',
    },
    {
      title: 'Network Security Layers',
      scenarioText: 'You\'re designing the network security for a multi-tier web application. The architecture includes a public-facing ALB, an application tier running on EC2, and an RDS database. All resources are in a VPC. How should you layer your security controls?',
      type: 'multiple_choice',
      difficulty: 'beginner',
      options: [
        { text: 'Use security groups at each tier: ALB allows HTTPS from 0.0.0.0/0, app tier allows HTTP only from the ALB security group, and RDS allows PostgreSQL only from the app tier security group', isCorrect: true, explanation: 'Correct! This follows "Apply security at all layers" — each tier only allows traffic from the specific upstream source. Security groups act as a virtual firewall at the instance/ENI level, providing stateful filtering.' },
        { text: 'Put everything in a public subnet and rely on the ALB for all security', isCorrect: false, explanation: 'Putting application and database tiers in public subnets exposes them directly to the internet. Defense in depth means having security controls at every layer, not just at the edge.' },
        { text: 'Use one large security group that allows all traffic between the tiers', isCorrect: false, explanation: 'A single security group that allows all internal traffic violates least privilege. Each tier should have its own security group with the minimum necessary rules.' },
        { text: 'Skip security groups and use only network ACLs for subnet-level filtering', isCorrect: false, explanation: 'Security groups and network ACLs are complementary, not alternatives. Security groups provide stateful instance-level filtering, while NACLs provide stateless subnet-level filtering. You need both for defense in depth.' },
      ],
    },
  ];

  // Reliability (5 scenarios)
  const reliabilityScenarios = [
    {
      title: 'Single-AZ Database Risk',
      scenarioText: 'Your startup\'s production database is a single PostgreSQL instance in us-east-1a. The CTO wants to ensure the application can survive an AZ outage. The database is 500GB and experiences moderate write load. What\'s the most appropriate approach?',
      type: 'multiple_choice',
      difficulty: 'beginner',
      options: [
        { text: 'Enable RDS Multi-AZ, which provisions a standby in a different AZ with synchronous replication and automatic failover', isCorrect: true, explanation: 'Correct! RDS Multi-AZ provides exactly this capability — a synchronous standby in another AZ with automatic failover in about 60 seconds. No application changes needed.' },
        { text: 'Take daily EBS snapshots and restore them in another AZ if the primary fails', isCorrect: false, explanation: 'Snapshots provide point-in-time recovery, not high availability. Restoring from a snapshot can take hours, resulting in unacceptable downtime. This is a backup strategy, not an HA strategy.' },
        { text: 'Set up PostgreSQL streaming replication manually on an EC2 instance in another AZ', isCorrect: false, explanation: 'While this could work, it requires significant operational overhead to manage replication, monitoring, and failover. RDS Multi-AZ handles all of this automatically, following the "Stop spending money on undifferentiated heavy lifting" principle.' },
        { text: 'Migrate to DynamoDB with global tables for multi-region availability', isCorrect: false, explanation: 'Migrating databases is a major undertaking. DynamoDB is a NoSQL database and may not support the application\'s query patterns. The simplest solution that meets the requirement is RDS Multi-AZ.' },
      ],
    },
    {
      title: 'Capacity Planning Under Uncertainty',
      scenarioText: 'Your e-commerce platform experiences 10x traffic spikes during flash sales, but normal traffic is relatively steady. You\'ve been provisioning enough EC2 capacity to handle peak load, which means 90% of your servers are idle most of the time. How would you redesign this using Well-Architected best practices?',
      type: 'open_ended',
      difficulty: 'intermediate',
      modelAnswer: 'Implement auto scaling based on demand metrics (CPU utilization, request count per target, or custom CloudWatch metrics). Use a target tracking scaling policy that maintains a desired CPU utilization (e.g., 60%). For flash sales, use scheduled scaling to pre-warm capacity before the event, combined with dynamic scaling to handle unexpected surges. Use a mix of On-Demand and Spot Instances to optimize cost. This follows the "Stop guessing capacity" principle — provision based on actual demand, not predictions. Also consider using serverless services (Lambda, Aurora Serverless) that scale automatically to zero when not in use.',
    },
    {
      title: 'Disaster Recovery Strategy',
      scenarioText: 'Your financial services application has a regulatory requirement of RPO ≤ 15 minutes and RTO ≤ 1 hour. Currently, all resources are in a single AWS region (us-east-1). You need to design a disaster recovery strategy. Which approach meets these requirements?',
      type: 'multiple_choice',
      difficulty: 'advanced',
      options: [
        { text: 'Active-passive DR with RDS cross-region read replicas, S3 CRR, and Route53 health-check-based failover to a pre-provisioned standby environment in us-west-2', isCorrect: true, explanation: 'Correct! Cross-region read replicas provide an RPO of seconds to minutes. A pre-provisioned standby environment (even if scaled down) ensures RTO can be met. Route53 health checks automate the failover. This follows "Test recovery procedures" and "Automatically recover from failure."' },
        { text: 'Take daily EBS snapshots and copy them to another region', isCorrect: false, explanation: 'Daily snapshots mean up to 24 hours of data loss, which exceeds the 15-minute RPO requirement. This is a backup strategy, not a DR strategy.' },
        { text: 'Use a pilot light approach with infrastructure provisioned but applications stopped', isCorrect: false, explanation: 'A pilot light approach typically has a longer RTO because you need to provision and start resources during the recovery. The 1-hour RTO requires a warm standby that can take over quickly.' },
        { text: 'Deploy active-active in two regions with Route53 weighted routing', isCorrect: false, explanation: 'Active-active is the most resilient approach but also the most complex and expensive. For a financial application, it may be justified, but the question asks for an approach that meets the requirements, not necessarily the most expensive one.' },
      ],
    },
    {
      title: 'Health Check Configuration',
      scenarioText: 'Your application\'s ALB health checks are configured to check the root path (/) every 5 seconds with a threshold of 2 consecutive failures. Recently, a database connection pool issue caused the application to return HTTP 503 errors, but the health check continued to pass because the root path only returns a static response. How would you fix this?',
      type: 'open_ended',
      difficulty: 'intermediate',
      modelAnswer: 'Create a dedicated /health endpoint that checks all critical dependencies: database connectivity, cache connectivity, and any downstream services. The health check should return 200 only if all dependencies are healthy, and 503 if any dependency is failing. Configure the ALB health check to use this endpoint with a reasonable interval (10 seconds) and unhealthy threshold (3 consecutive failures). Also set up CloudWatch composite alarms that monitor the health check failure rate and trigger automated remediation. This follows the "Automatically recover from failure" principle — the system should detect and respond to failures without human intervention.',
    },
    {
      title: 'Backup Strategy Review',
      scenarioText: 'Your company has been running on AWS for 2 years without ever testing a database restore. The RDS automated backups are enabled with 35-day retention, but no one knows if the backups are actually restorable. What should you do?',
      type: 'multiple_choice',
      difficulty: 'beginner',
      options: [
        { text: 'Schedule a quarterly restore test where you restore the backup to a staging environment and verify data integrity', isCorrect: true, explanation: 'Correct! The "Test recovery procedures" principle explicitly states you must regularly test your recovery procedures. A backup that hasn\'t been tested is not a backup — it\'s a hope.' },
        { text: 'Trust that AWS handles backup reliability since it\'s a managed service', isCorrect: false, explanation: 'While AWS manages the infrastructure, you are responsible for verifying that your data is restorable. The shared responsibility model means you own the validation of your backup strategy.' },
        { text: 'Enable deletion protection on the database instead of testing backups', isCorrect: false, explanation: 'Deletion protection prevents accidental deletion but does nothing for data corruption, logical errors, or region-level failures. Backups and restore testing are still essential.' },
        { text: 'Take a manual snapshot once and verify it restores, then rely on automated backups', isCorrect: false, explanation: 'A single test doesn\'t prove ongoing reliability. Backups can become corrupted, permissions can change, and configurations can drift. Regular testing is required.' },
      ],
    },
  ];

  // Performance Efficiency (5 scenarios)
  const perfScenarios = [
    {
      title: 'Database Performance Tuning',
      scenarioText: 'Your application\'s performance has degraded as user growth has accelerated. Queries that used to take 50ms now take 2 seconds. You\'re using RDS PostgreSQL with a db.r5.large instance. The CPU is at 80% during peak hours. What\'s the most appropriate first step?',
      type: 'multiple_choice',
      difficulty: 'intermediate',
      options: [
        { text: 'Enable RDS Performance Insights to identify the specific queries causing the bottleneck, then optimize indexes or queries', isCorrect: true, explanation: 'Correct! The "Experiment more often" principle means you should diagnose before treating. Performance Insights shows you exactly which queries are consuming the most resources, so you can make targeted improvements.' },
        { text: 'Immediately upgrade to db.r5.xlarge to double the compute capacity', isCorrect: false, explanation: 'Throwing hardware at a performance problem without understanding the root cause is wasteful and may not solve the issue. The bottleneck could be a missing index, a poorly written query, or a lock contention issue.' },
        { text: 'Migrate to DynamoDB for all database operations', isCorrect: false, explanation: 'Migrating databases is a major undertaking that should not be the first step. The issue may be solvable with a simple index addition. Also, DynamoDB is not a drop-in replacement for PostgreSQL.' },
        { text: 'Add an RDS read replica and move all read traffic to it', isCorrect: false, explanation: 'Read replicas help with read scaling but don\'t address the root cause of slow queries. If the queries are slow on the primary, they\'ll be slow on the replica too.' },
      ],
    },
    {
      title: 'Global User Experience',
      scenarioText: 'Your SaaS application is hosted in us-east-1, but you have growing user bases in Europe and Asia-Pacific. Users in those regions report slow load times (3-5 seconds for initial page load). The application serves a mix of static assets (images, CSS, JS) and dynamic API responses. How would you improve performance for global users?',
      type: 'open_ended',
      difficulty: 'intermediate',
      modelAnswer: 'Implement a multi-pronged approach: (1) Deploy Amazon CloudFront as a CDN to cache static assets at 400+ edge locations worldwide, reducing latency for static content. (2) Use origin shielding to reduce load on the origin server. (3) For dynamic API responses, use CloudFront with cache behaviors that forward cookies/headers for personalized content but cache common responses. (4) Consider using AWS Global Accelerator for the dynamic API traffic — it uses the AWS global network instead of the public internet. (5) For the database layer, consider read replicas in other regions if the workload is read-heavy. This follows the "Go global in minutes" design principle.',
    },
    {
      title: 'Serverless vs. Container Decision',
      scenarioText: 'You\'re designing a new data processing pipeline that needs to handle variable workloads — sometimes 100 records/day, sometimes 10 million. The processing takes 5-10 minutes per batch. Your team has experience with Docker but not with serverless. Which architecture would you recommend?',
      type: 'multiple_choice',
      difficulty: 'beginner',
      options: [
        { text: 'Use AWS Lambda with SQS for the processing pipeline — it scales to zero when idle and handles spikes automatically, and the 15-minute timeout is sufficient for 5-10 minute batches', isCorrect: true, explanation: 'Correct! Lambda\'s 15-minute timeout accommodates the batch processing time. The "Use serverless architectures" principle applies here — automatic scaling, no idle capacity, and pay-per-use pricing. The team can learn Lambda quickly.' },
        { text: 'Provision a large EC2 instance 24/7 to handle peak capacity', isCorrect: false, explanation: 'Running a large instance 24/7 for a workload that sometimes processes 100 records/day is extremely wasteful. The "Adopt a consumption model" principle means you should pay only for what you use.' },
        { text: 'Use Amazon ECS with Fargate and auto scaling to handle the variable load', isCorrect: false, explanation: 'Fargate is a good option, but for this specific workload, Lambda is simpler and more cost-effective. Fargate requires managing task definitions, container images, and auto scaling policies. Lambda is truly serverless.' },
        { text: 'Use Amazon EMR with a persistent cluster', isCorrect: false, explanation: 'EMR is designed for big data processing (Hadoop, Spark) and is overkill for this use case. It also requires managing cluster lifecycle and has higher operational overhead.' },
      ],
    },
    {
      title: 'Cache Strategy Design',
      scenarioText: 'Your application\'s product catalog API is called 10,000 times per minute, but the underlying data only changes a few times per day. Each API call queries DynamoDB, which is expensive and adds latency. How would you optimize this?',
      type: 'open_ended',
      difficulty: 'beginner',
      modelAnswer: 'Implement a multi-layer caching strategy: (1) Use Amazon CloudFront or API Gateway caching at the edge to cache API responses. Set the TTL to 5-10 minutes (or longer, with cache invalidation when data changes). (2) Use Amazon ElastiCache (Redis) as an application-level cache between the API and DynamoDB. Cache the product catalog data and invalidate it when the catalog is updated. (3) Consider using DynamoDB Accelerator (DAX) for microsecond latency on frequently accessed items. This follows the "Consider mechanical sympathy" principle — match your data access patterns to the right caching technology. The result is dramatically lower latency and reduced DynamoDB read capacity costs.',
    },
    {
      title: 'Load Testing Strategy',
      scenarioText: 'Your team is preparing for a major product launch expected to bring 50x normal traffic. You\'ve never load-tested the application. The CTO wants confidence that the system won\'t collapse under load. What approach do you recommend?',
      type: 'multiple_choice',
      difficulty: 'intermediate',
      options: [
        { text: 'Use AWS Distributed Load Testing or a tool like Artillery to gradually ramp up traffic in a staging environment, monitoring key metrics and identifying bottlenecks before the launch', isCorrect: true, explanation: 'Correct! The "Experiment more often" principle means you should test before the event. Gradual ramp-up lets you identify the breaking point and optimize before the launch. Monitor CPU, memory, database connections, and application latency.' },
        { text: 'Provision 50x the normal capacity and hope for the best', isCorrect: false, explanation: 'Without load testing, you don\'t know if the bottleneck is compute, database, network, or application logic. Throwing capacity at the problem without testing is expensive and may not solve the actual bottleneck.' },
        { text: 'Launch and monitor closely, scaling up if issues arise', isCorrect: false, explanation: 'This is a reactive approach that risks a poor customer experience during the launch. First impressions matter — if the site crashes on launch day, you may lose customers permanently.' },
        { text: 'Use AWS Compute Optimizer to recommend instance types for the expected load', isCorrect: false, explanation: 'Compute Optimizer analyzes historical utilization to recommend rightsizing, not to predict capacity needs for a 50x traffic spike. It cannot simulate the actual application behavior under load.' },
      ],
    },
  ];

  // Cost Optimization (5 scenarios)
  const costScenarios = [
    {
      title: 'Idle Resource Detection',
      scenarioText: 'Your monthly AWS bill has increased by 40% over the past quarter. Upon initial review, you notice several EC2 instances that were launched for testing months ago and never terminated. There are also EBS volumes that are not attached to any instance, and old EBS snapshots going back 2 years. How would you systematically address this?',
      type: 'multiple_choice',
      difficulty: 'beginner',
      options: [
        { text: 'Use AWS Trusted Advisor and Cost Explorer to identify idle resources, then implement automated lifecycle policies and tag enforcement', isCorrect: true, explanation: 'Correct! Trusted Advisor identifies idle resources, Cost Explorer shows spending patterns, and automated policies prevent future waste. This follows "Analyze and attribute expenditure" and "Adopt a consumption model."' },
        { text: 'Ask each team to review their resources and report back', isCorrect: false, explanation: 'Manual reviews are unreliable and don\'t scale. Without automated enforcement, the same problem will recur. The "Implement cloud financial management" principle requires systematic governance.' },
        { text: 'Terminate all EC2 instances and EBS volumes that are not tagged', isCorrect: false, explanation: 'Terminating untagged resources is too aggressive — some untagged resources may be production-critical. You need to identify ownership first, then take action.' },
        { text: 'Increase the budget and accept the higher costs as "cloud growth"', isCorrect: false, explanation: 'Accepting waste without investigation is contrary to the entire Cost Optimization pillar. The goal is to maximize business value, not to maximize spending.' },
      ],
    },
    {
      title: 'Reserved Capacity Decision',
      scenarioText: 'You have 20 EC2 instances running a production workload 24/7/365. The workload is stable and predictable. You\'re currently paying On-Demand prices. What\'s the most cost-effective pricing model?',
      type: 'multiple_choice',
      difficulty: 'beginner',
      options: [
        { text: 'Purchase 3-year Compute Savings Plans covering the baseline capacity, which offers the deepest discounts (up to 66%) for steady-state workloads', isCorrect: true, explanation: 'Correct! Savings Plans offer significant discounts for committing to a consistent amount of compute usage. For predictable, always-on workloads, longer-term commitments provide the best savings.' },
        { text: 'Use Spot Instances for all 20 instances', isCorrect: false, explanation: 'Spot Instances can be interrupted with 2-minute notice, making them unsuitable for always-on production workloads. They\'re best for fault-tolerant, flexible workloads.' },
        { text: 'Keep paying On-Demand prices for maximum flexibility', isCorrect: false, explanation: 'On-Demand is the most expensive pricing model. For predictable workloads, you\'re paying a premium for flexibility you don\'t need. The "Adopt a consumption model" principle means you should choose the most cost-effective pricing for your usage pattern.' },
        { text: 'Use Dedicated Hosts for better cost control', isCorrect: false, explanation: 'Dedicated Hosts are typically more expensive than On-Demand and are used for licensing or compliance requirements, not cost savings. They would increase costs, not reduce them.' },
      ],
    },
    {
      title: 'Storage Tier Optimization',
      scenarioText: 'Your company stores 50TB of customer documents in S3 Standard. Analysis shows that documents older than 30 days are accessed less than once per month, and documents older than 1 year are never accessed (but must be retained for 7 years for compliance). How would you optimize storage costs?',
      type: 'open_ended',
      difficulty: 'intermediate',
      modelAnswer: 'Implement S3 Lifecycle policies: (1) Transition objects to S3 Standard-IA after 30 days (lower storage cost, but retrieval fee — appropriate for infrequent access). (2) Transition to S3 Glacier Instant Retrieval after 90 days (very low storage cost, millisecond retrieval for occasional access). (3) Transition to S3 Glacier Deep Archive after 365 days (lowest storage cost, 12-hour retrieval — acceptable for compliance retention). (4) Set expiration to delete after 7 years. Use S3 Intelligent-Tiering if access patterns are unpredictable. Use S3 Storage Lens for ongoing visibility. This follows the "Measure overall efficiency" principle — you\'re optimizing cost based on actual usage patterns.',
    },
    {
      title: 'FinOps Implementation',
      scenarioText: 'Your organization has 10 teams sharing a single AWS account. There\'s no way to tell which team is driving costs, and the monthly bill is a black box. The finance team wants to implement chargebacks. How would you set this up?',
      type: 'open_ended',
      difficulty: 'advanced',
      modelAnswer: 'Implement a comprehensive cost governance framework: (1) Move to a multi-account strategy using AWS Organizations, with each team having its own account for clear cost isolation. (2) Implement a mandatory tagging strategy (CostCenter, Team, Environment, Project) enforced by AWS Config rules and SCPs. (3) Use AWS Cost Explorer with tag-based filtering to generate per-team cost reports. (4) Set up AWS Budgets with alerts at 80% and 100% of budget for each team. (5) Use Cost Allocation Tags to track resources that can\'t be separated by account. (6) Hold regular FinOps reviews where teams review their spending and identify optimization opportunities. This follows "Implement cloud financial management" and "Analyze and attribute expenditure."',
    },
    {
      title: 'Managed Service vs. Self-Hosted',
      scenarioText: 'Your team currently runs a self-managed Redis cluster on EC2 for caching. You\'re spending about 10 hours per month on patching, monitoring, and failover testing. The EC2 instances cost $500/month. Amazon ElastiCache for Redis would cost $600/month but requires zero operational overhead. What should you do?',
      type: 'multiple_choice',
      difficulty: 'intermediate',
      options: [
        { text: 'Migrate to ElastiCache — the $100/month premium is justified by eliminating 10 hours of operational work, which likely costs more than $100 in engineering time', isCorrect: true, explanation: 'Correct! This follows "Stop spending money on undifferentiated heavy lifting." The total cost of ownership includes operational overhead, not just infrastructure costs. ElastiCache also provides better availability, automated patching, and built-in monitoring.' },
        { text: 'Keep the self-managed Redis cluster to save $100/month', isCorrect: false, explanation: 'Saving $100/month while spending 10 hours of engineering time is false economy. At $100/hour engineering cost, that\'s $1,000/month in labor — far more than the $100 infrastructure savings.' },
        { text: 'Migrate to DynamoDB as a cache replacement', isCorrect: false, explanation: 'DynamoDB is a database, not a cache. While DAX provides caching, replacing Redis with DynamoDB would require significant application changes and may not support all Redis data structures.' },
        { text: 'Negotiate with AWS for a discount on ElastiCache', isCorrect: false, explanation: 'While you can negotiate, the $100/month difference is small and the operational savings are clear. The decision should be based on total cost of ownership, not just the list price.' },
      ],
    },
  ];

  // Sustainability (5 scenarios)
  const sustainabilityScenarios = [
    {
      title: 'Carbon Footprint Assessment',
      scenarioText: 'Your company has committed to reducing its cloud carbon footprint by 50% over the next 2 years. You need to establish a baseline and identify the biggest opportunities for improvement. What\'s your first step?',
      type: 'multiple_choice',
      difficulty: 'beginner',
      options: [
        { text: 'Use the AWS Customer Carbon Footprint Tool to establish a baseline, then identify the highest-emission workloads for optimization', isCorrect: true, explanation: 'Correct! The "Understand your impact" principle starts with measurement. The Carbon Footprint Tool shows your historical and current emissions, broken down by service and region, so you can prioritize the biggest opportunities.' },
        { text: 'Immediately migrate all workloads to Graviton instances', isCorrect: false, explanation: 'Migrating without understanding your current footprint means you can\'t measure progress. Some workloads may benefit more from other optimizations (e.g., right-sizing, serverless).' },
        { text: 'Turn off all non-production environments on weekends', isCorrect: false, explanation: 'While this is a good practice, it should be part of a broader strategy informed by data. You need to measure first to know if this is the most impactful change.' },
        { text: 'Purchase carbon offsets to compensate for cloud emissions', isCorrect: false, explanation: 'Offsets address the symptom, not the cause. The Well-Architected Framework\'s Sustainability pillar focuses on reducing emissions through architectural improvements, not offsetting them.' },
      ],
    },
    {
      title: 'Graviton Migration Planning',
      scenarioText: 'Your CTO wants to migrate all workloads to Graviton-based instances to improve sustainability. However, your application includes a legacy Java service that uses native libraries with x86-specific optimizations. How should you approach this?',
      type: 'open_ended',
      difficulty: 'advanced',
      modelAnswer: 'Take a phased approach: (1) Audit all workloads to identify which are Graviton-compatible (most modern applications using interpreted or compiled-to-IL languages like Java, Python, Node.js are compatible). (2) For the legacy Java service, test it on Graviton in a staging environment — Java bytecode is architecture-independent, but native JNI libraries need Arm64 versions. (3) If the native libraries can\'t be migrated, consider containerizing the service and using x86 instances only for that workload, while migrating everything else to Graviton. (4) Use AWS Compute Optimizer to validate that Graviton instances are appropriately sized. (5) Measure the carbon reduction using the Customer Carbon Footprint Tool. This follows "Anticipate and adopt new, more efficient hardware" while being pragmatic about constraints.',
    },
    {
      title: 'Idle Development Environments',
      scenarioText: 'Your development team has 50 EC2 instances that run 24/7 for development and testing. These instances are only used during business hours (8 hours/day, 5 days/week). The team often forgets to stop them at the end of the day. How would you reduce the environmental impact and cost?',
      type: 'multiple_choice',
      difficulty: 'beginner',
      options: [
        { text: 'Use AWS Instance Scheduler to automatically stop instances at 7 PM and start them at 7 AM on weekdays, reducing runtime by 60%', isCorrect: true, explanation: 'Correct! This follows "Maximize utilization" — instances that are idle 60% of the time are wasteful. Automated scheduling eliminates the reliance on human memory and reduces both cost and carbon footprint.' },
        { text: 'Send a daily reminder email to the team to stop their instances', isCorrect: false, explanation: 'Email reminders are unreliable and don\'t scale. The "Automate security best practices" principle applies here — automate the solution rather than relying on manual compliance.' },
        { text: 'Terminate all development instances and use CloudShell instead', isCorrect: false, explanation: 'CloudShell is a browser-based shell and cannot replace full development environments. This would severely impact developer productivity.' },
        { text: 'Keep them running 24/7 to avoid disrupting developers who work late', isCorrect: false, explanation: 'While some developers may work late, the majority don\'t. A better approach is to use Instance Scheduler with an override mechanism for developers who need instances outside of normal hours.' },
      ],
    },
    {
      title: 'Data Storage Sustainability',
      scenarioText: 'Your data lake in S3 has grown to 200TB, and you estimate that 40% of the data has never been accessed since it was stored. The data includes logs, backups, and historical analytics data. How would you reduce the environmental impact of this data storage?',
      type: 'open_ended',
      difficulty: 'intermediate',
      modelAnswer: 'Implement a comprehensive data lifecycle strategy: (1) Use S3 Storage Lens to analyze access patterns and identify unused data. (2) Implement S3 Lifecycle policies to transition unused data to colder storage tiers (Standard-IA → Glacier Instant Retrieval → Glacier Deep Archive). (3) Set up data expiration policies to delete data that is no longer needed (e.g., logs older than 90 days, temporary files older than 30 days). (4) Use S3 Intelligent-Tiering for data with unknown access patterns. (5) Compress data before storing (e.g., use Parquet format for analytics data, gzip for logs). (6) Implement a data retention policy with stakeholders to define how long different data types must be kept. This follows "Maximize utilization" — storing data that is never accessed wastes both money and energy.',
    },
    {
      title: 'Architecture Efficiency Review',
      scenarioText: 'Your batch processing job runs on a large EC2 instance 24/7, processing data in 2-hour batches that arrive every 4 hours. The rest of the time, the instance is idle. The job is written in Python and processes files from S3. How would you make this more sustainable?',
      type: 'multiple_choice',
      difficulty: 'intermediate',
      options: [
        { text: 'Migrate to AWS Lambda triggered by S3 events — the function only runs when data arrives, scales automatically, and uses Graviton processors for better energy efficiency', isCorrect: true, explanation: 'Correct! This follows "Use serverless architectures" and "Maximize utilization." The Lambda function runs only when needed, uses energy-efficient Graviton processors, and scales to zero when idle. The 15-minute Lambda timeout may require splitting the batch into smaller chunks.' },
        { text: 'Keep the EC2 instance but use a scheduled scaling policy to stop it when not in use', isCorrect: false, explanation: 'While better than running 24/7, this still requires managing an EC2 instance, patching it, and handling the startup time. Serverless is a more sustainable and operationally simpler approach.' },
        { text: 'Use a larger instance to finish the batch faster, then stop it', isCorrect: false, explanation: 'A larger instance consumes more energy per hour. Even if it finishes faster, the total energy consumption may be similar or higher. The goal is to eliminate idle time, not to process faster.' },
        { text: 'Move the processing to on-premises servers to reduce cloud energy use', isCorrect: false, explanation: 'On-premises servers typically have lower utilization rates and less efficient power and cooling than AWS data centers. AWS data centers are designed for energy efficiency and use renewable energy.' },
      ],
    },
  ];

  // ── CROSS-PILLAR SCENARIOS (8 scenarios) ─────────────────────────

  const crossPillarScenarios = [
    {
      title: 'Cost vs. Reliability Trade-off',
      scenarioText: 'Your startup needs to decide on a database architecture. Option A: RDS Multi-AZ ($800/month) provides automatic failover and 99.95% availability SLA. Option B: Single-AZ RDS with automated backups ($400/month) has manual failover that takes 15-30 minutes. Your application is customer-facing but not mission-critical — 30 minutes of downtime per incident is acceptable to the business. The startup is burning through its seed funding and needs to extend its runway by 6 months. Which option aligns with Well-Architected best practices?',
      type: 'multiple_choice',
      difficulty: 'intermediate',
      isCrossPillar: true,
      pillars: ['cost-optimization', 'reliability'],
      options: [
        { text: 'Start with Single-AZ RDS to conserve cash, but implement automated backup restores and document the recovery procedure. Plan to migrate to Multi-AZ after the next funding round.', isCorrect: true, explanation: 'Correct! This is a pragmatic trade-off. The Cost Optimization pillar says to "Adopt a consumption model" and not over-provision for capacity you don\'t need. The Reliability pillar says to "Test recovery procedures" — so document and test the manual failover. The key is making an informed decision based on business requirements.' },
        { text: 'Always choose Multi-AZ for any production database regardless of cost', isCorrect: false, explanation: 'This ignores the Cost Optimization pillar entirely. Not every workload needs Multi-AZ. The Well-Architected Framework is about making trade-offs based on business context, not applying a one-size-fits-all rule.' },
        { text: 'Use Single-AZ and don\'t worry about backups since you\'re a startup', isCorrect: false, explanation: 'Not having backups is irresponsible regardless of company stage. The Reliability pillar\'s "Test recovery procedures" still applies — you need some form of recovery capability.' },
        { text: 'Use DynamoDB with auto scaling since it\'s cheaper than RDS', isCorrect: false, explanation: 'DynamoDB may or may not be cheaper depending on access patterns, and migrating databases is a significant effort. The question is about the RDS architecture decision, not about switching database technologies.' },
      ],
    },
    {
      title: 'Security vs. Operational Excellence',
      scenarioText: 'Your security team requires all IAM policy changes to go through a 3-day review process. Your development team needs to deploy critical security patches within hours of a CVE announcement. The current process means patches are delayed by 3 days, leaving systems vulnerable. How do you resolve this conflict?',
      type: 'open_ended',
      difficulty: 'advanced',
      isCrossPillar: true,
      pillars: ['security', 'operational-excellence'],
      modelAnswer: 'Implement a tiered change management process: (1) Define categories of changes — emergency security patches, standard changes, and minor changes. (2) For emergency security patches, create a pre-approved "security response" pipeline that uses automated CI/CD with infrastructure as code. The IAM policy changes are reviewed as code in a pull request, but the review is expedited (1 hour instead of 3 days) for security-critical changes. (3) Use IAM permission boundaries and SCPs to limit the maximum permissions any change can grant, reducing the risk of a bad change. (4) After the emergency change, conduct a post-mortem to improve the process. This balances the Security pillar\'s "Automate security best practices" with the Operational Excellence pillar\'s "Make frequent, small, reversible changes."',
    },
    {
      title: 'Performance vs. Cost',
      scenarioText: 'Your application\'s search feature uses Amazon OpenSearch Service. The current cluster (3 x r6g.large.search instances) costs $900/month and handles search queries with p99 latency of 200ms. A user experience study shows that reducing latency to under 50ms would increase user engagement by 15%. To achieve this, you\'d need to upgrade to 3 x r6g.xlarge.search instances at $1,800/month. The additional $900/month would reduce the company\'s profitability by 2%. What do you recommend?',
      type: 'multiple_choice',
      difficulty: 'intermediate',
      isCrossPillar: true,
      pillars: ['performance-efficiency', 'cost-optimization'],
      options: [
        { text: 'Implement caching with ElastiCache for frequent searches and optimize index mappings before upgrading hardware — this may achieve the latency target at a fraction of the cost', isCorrect: true, explanation: 'Correct! The Performance Efficiency pillar says "Experiment more often" and "Consider mechanical sympathy." Before spending more money, optimize the existing setup. Caching, query optimization, and index tuning can often achieve significant improvements without additional infrastructure cost.' },
        { text: 'Upgrade to the larger instances — the 15% engagement increase justifies the cost', isCorrect: false, explanation: 'This may be the right business decision, but you should exhaust optimization options first. The Cost Optimization pillar says "Measure overall efficiency" — you need to compare the cost of optimization vs. the cost of upgrading.' },
        { text: 'Keep the current setup since 200ms is acceptable', isCorrect: false, explanation: 'Ignoring a known opportunity to improve user engagement is not aligned with either pillar. The question is about finding the most efficient path to the goal.' },
        { text: 'Migrate to Amazon CloudSearch which is cheaper', isCorrect: false, explanation: 'Migrating search platforms is a major undertaking with significant risk. The cost of migration and potential downtime should be considered before switching platforms.' },
      ],
    },
    {
      title: 'Reliability vs. Sustainability',
      scenarioText: 'Your disaster recovery strategy requires maintaining a warm standby environment in a second region that runs 24/7. This doubles your infrastructure footprint and significantly increases your carbon emissions. Your sustainability officer wants to reduce the environmental impact. How can you balance reliability requirements with sustainability goals?',
      type: 'open_ended',
      difficulty: 'advanced',
      isCrossPillar: true,
      pillars: ['reliability', 'sustainability'],
      modelAnswer: 'Several approaches to reduce the DR environment\'s impact: (1) Use a "pilot light" approach instead of a full warm standby — keep the minimum infrastructure running (e.g., a small RDS instance with replication) and use infrastructure as code to provision the remaining resources during a failover. (2) Use Graviton-based instances in the DR region for better energy efficiency. (3) Use Auto Scaling to run the DR environment at minimum capacity, only scaling up during a DR test or actual failover. (4) Schedule regular DR tests that also serve as validation — this satisfies the Reliability pillar\'s "Test recovery procedures" while keeping the standby environment minimal. (5) Use the AWS Customer Carbon Footprint Tool to measure the impact of different DR strategies and choose the most sustainable option that still meets RTO/RPO requirements.',
    },
    {
      title: 'Security vs. Performance',
      scenarioText: 'Your security team mandates that all API traffic must be inspected by a third-party web application firewall (WAF) that adds 50ms of latency per request. Your performance team has a target of p99 latency under 100ms for the API. The WAF inspection alone consumes half the latency budget. How do you resolve this?',
      type: 'multiple_choice',
      difficulty: 'intermediate',
      isCrossPillar: true,
      pillars: ['security', 'performance-efficiency'],
      options: [
        { text: 'Use AWS WAF instead of the third-party solution — it integrates natively with CloudFront/ALB, has lower latency overhead, and provides managed rule groups for common threats', isCorrect: true, explanation: 'Correct! AWS WAF is designed for low-latency inline inspection and integrates directly with AWS services. The "Democratize advanced technologies" principle means using AWS-managed security services that are optimized for the platform. This satisfies both security requirements and performance targets.' },
        { text: 'Accept the 50ms latency and tell the performance team to optimize elsewhere', isCorrect: false, explanation: 'This doesn\'t resolve the conflict — it just prioritizes security over performance. The Well-Architected Framework encourages finding solutions that satisfy multiple pillars.' },
        { text: 'Remove the WAF inspection to meet performance targets', isCorrect: false, explanation: 'Removing security controls to meet performance targets is not acceptable. The Security pillar\'s "Apply security at all layers" means you need web application firewall protection.' },
        { text: 'Use CloudFront with Lambda@Edge for WAF inspection to reduce latency', isCorrect: false, explanation: 'Lambda@Edge is not a WAF replacement. While it can do some request inspection, it doesn\'t provide the comprehensive threat protection that a WAF offers. AWS WAF at CloudFront is the right approach.' },
      ],
    },
    {
      title: 'Cost vs. Operational Excellence',
      scenarioText: 'Your team manages 50 microservices, each deployed independently. The current deployment process is fully automated with CI/CD, monitoring, and automated rollback. A new VP of Engineering wants to consolidate to a monolith to "reduce infrastructure costs." The current infrastructure costs $15,000/month. A monolith would cost approximately $8,000/month. What do you recommend?',
      type: 'open_ended',
      difficulty: 'advanced',
      isCrossPillar: true,
      pillars: ['cost-optimization', 'operational-excellence'],
      modelAnswer: 'The cost comparison is incomplete. Consider: (1) The $7,000/month savings in infrastructure may be offset by increased development costs — a monolith is harder to deploy, test, and scale independently. (2) The Operational Excellence pillar emphasizes "Make frequent, small, reversible changes" — microservices enable independent deployment of small changes. (3) Instead of a full consolidation, optimize the current setup: identify services with low traffic that can be consolidated, use Graviton instances, implement auto scaling to reduce idle capacity, and use Savings Plans. (4) Consider serverless (Lambda, Fargate) for low-traffic services to reduce costs further. (5) Measure the total cost of ownership including engineering time, not just infrastructure costs. The right answer is likely to optimize rather than consolidate.',
    },
    {
      title: 'Performance vs. Sustainability',
      scenarioText: 'Your real-time analytics application requires sub-millisecond latency for dashboard queries. You\'re using memory-optimized EC2 instances (r6i) with all data stored in memory. A sustainability audit shows this is your highest-emission workload. The team is considering switching to Graviton-based instances (r7g) which are 30% more energy-efficient but may have slightly different performance characteristics. What should you do?',
      type: 'multiple_choice',
      difficulty: 'intermediate',
      isCrossPillar: true,
      pillars: ['performance-efficiency', 'sustainability'],
      options: [
        { text: 'Benchmark the workload on r7g instances in a staging environment to compare latency and throughput before migrating', isCorrect: true, explanation: 'Correct! The Performance Efficiency pillar says "Experiment more often" — test before migrating. Graviton instances often match or exceed x86 performance for many workloads. If benchmarks show acceptable performance, the migration reduces both cost and carbon footprint.' },
        { text: 'Stay on r6i instances since performance is critical and any risk is unacceptable', isCorrect: false, explanation: 'This dismisses sustainability goals without investigation. The Sustainability pillar says "Anticipate and adopt new, more efficient hardware" — you should at least evaluate the option.' },
        { text: 'Migrate immediately to r7g to meet sustainability goals', isCorrect: false, explanation: 'Migrating without testing risks performance degradation for a latency-sensitive workload. The "Experiment more often" principle means you should validate in a staging environment first.' },
        { text: 'Use a mix of r6i and r7g instances and route traffic based on query complexity', isCorrect: false, explanation: 'This adds unnecessary complexity. If r7g instances meet performance requirements, there\'s no need to maintain two instance families. If they don\'t, you shouldn\'t use them at all.' },
      ],
    },
    {
      title: 'Security vs. Cost Optimization',
      scenarioText: 'Your security team wants to enable AWS Shield Advanced ($3,000/month) for DDoS protection on your CloudFront distribution. Your application is a small e-commerce site with $50,000/month in revenue. The site has never experienced a DDoS attack. The cost of Shield Advanced represents 6% of revenue. How should you decide?',
      type: 'multiple_choice',
      difficulty: 'beginner',
      isCrossPillar: true,
      pillars: ['security', 'cost-optimization'],
      options: [
        { text: 'Start with AWS Shield Standard (free) and AWS WAF rate-based rules for basic DDoS protection. Re-evaluate Shield Advanced if the business grows or if you experience an attack.', isCorrect: true, explanation: 'Correct! This follows the Cost Optimization principle of "Adopt a consumption model" — don\'t pay for protection you may not need. Shield Standard and WAF provide meaningful DDoS protection at no additional cost. You can upgrade to Shield Advanced later if the risk profile changes.' },
        { text: 'Always enable Shield Advanced because security is the top priority', isCorrect: false, explanation: 'The Well-Architected Framework is about balancing trade-offs. For a small e-commerce site, 6% of revenue for DDoS protection that may never be needed is not a good use of limited resources.' },
        { text: 'Skip DDoS protection entirely since you\'ve never been attacked', isCorrect: false, explanation: 'This is too risky. Shield Standard is free and provides baseline DDoS protection. The Security pillar says "Apply security at all layers" — basic DDoS protection should be part of your defense-in-depth strategy.' },
        { text: 'Use a third-party DDoS protection service that costs $1,000/month', isCorrect: false, explanation: 'This is cheaper than Shield Advanced but still an unnecessary expense. Start with the free options (Shield Standard + WAF) and only pay for more if needed.' },
      ],
    },
  ];

  // Helper to create a scenario with its options/pillars
  async function createScenario(
    data: {
      title: string;
      scenarioText: string;
      type: string;
      difficulty: string;
      modelAnswer?: string;
      isCrossPillar?: boolean;
      options?: { text: string; isCorrect: boolean; explanation: string }[];
      pillars?: string[];
    },
    pillarMap: Record<string, { id: number }>
  ) {
    // Skip if a scenario with this title already exists — preserves user attempt data
    const existing = await prisma.scenario.findFirst({ where: { title: data.title } });
    if (existing) return;

    const scenario = await prisma.scenario.create({
      data: {
        title: data.title,
        scenarioText: data.scenarioText,
        type: data.type,
        difficulty: data.difficulty,
        isCrossPillar: data.isCrossPillar || false,
        modelAnswer: data.modelAnswer || null,
      },
    });

    // Link pillars
    const targetPillars = data.pillars || [determinePillarSlug(data.title, pillarMap)];
    for (const slug of targetPillars) {
      const p = pillarMap[slug];
      if (p) {
        await prisma.scenarioPillar.create({
          data: {
            scenarioId: scenario.id,
            pillarId: p.id,
            isPrimary: slug === targetPillars[0],
          },
        });
      }
    }

    // Create options for multiple_choice
    if (data.options) {
      for (const opt of data.options) {
        await prisma.scenarioOption.create({
          data: {
            scenarioId: scenario.id,
            text: opt.text,
            isCorrect: opt.isCorrect,
            explanation: opt.explanation,
          },
        });
      }
    }
  }

  function determinePillarSlug(title: string, pillarMap: Record<string, { id: number }>): string {
    // Map scenario titles to their primary pillar
    const mapping: Record<string, string> = {
      'Deployment Pipeline Failure': 'operational-excellence',
      'Runbook Review Gap': 'operational-excellence',
      'Post-Incident Improvement': 'operational-excellence',
      'Change Management Without Automation': 'operational-excellence',
      'Monitoring Blind Spots': 'operational-excellence',
      'S3 Bucket Exposure': 'security',
      'Cross-Account Access Design': 'security',
      'Encryption Strategy Decision': 'security',
      'Incident Response Automation': 'security',
      'Network Security Layers': 'security',
      'Single-AZ Database Risk': 'reliability',
      'Capacity Planning Under Uncertainty': 'reliability',
      'Disaster Recovery Strategy': 'reliability',
      'Health Check Configuration': 'reliability',
      'Backup Strategy Review': 'reliability',
      'Database Performance Tuning': 'performance-efficiency',
      'Global User Experience': 'performance-efficiency',
      'Serverless vs. Container Decision': 'performance-efficiency',
      'Cache Strategy Design': 'performance-efficiency',
      'Load Testing Strategy': 'performance-efficiency',
      'Idle Resource Detection': 'cost-optimization',
      'Reserved Capacity Decision': 'cost-optimization',
      'Storage Tier Optimization': 'cost-optimization',
      'FinOps Implementation': 'cost-optimization',
      'Managed Service vs. Self-Hosted': 'cost-optimization',
      'Carbon Footprint Assessment': 'sustainability',
      'Graviton Migration Planning': 'sustainability',
      'Idle Development Environments': 'sustainability',
      'Data Storage Sustainability': 'sustainability',
      'Architecture Efficiency Review': 'sustainability',
    };
    return mapping[title] || 'operational-excellence';
  }

  const allPillars: Record<string, { id: number }> = {
    'operational-excellence': opEx,
    'security': security,
    'reliability': reliability,
    'performance-efficiency': perfEfficiency,
    'cost-optimization': costOptimization,
    'sustainability': sustainability,
  };

  // Create single-pillar scenarios
  for (const s of opExScenarios) await createScenario(s, allPillars);
  for (const s of securityScenarios) await createScenario(s, allPillars);
  for (const s of reliabilityScenarios) await createScenario(s, allPillars);
  for (const s of perfScenarios) await createScenario(s, allPillars);
  for (const s of costScenarios) await createScenario(s, allPillars);
  for (const s of sustainabilityScenarios) await createScenario(s, allPillars);

  // Create cross-pillar scenarios
  for (const s of crossPillarScenarios) await createScenario(s, allPillars);

  const totalInSeed = opExScenarios.length + securityScenarios.length + reliabilityScenarios.length +
    perfScenarios.length + costScenarios.length + sustainabilityScenarios.length + crossPillarScenarios.length;
  const totalInDb = await prisma.scenario.count();
  console.log(`  Scenarios: ${totalInDb} in DB (${totalInSeed} defined in seed, ${crossPillarScenarios.length} cross-pillar)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });