const actionConfig = {
    updateProfile: {
        formSections: [
            {
                title: 'Personal Details',
                fields: {
                    firstName: {
                        type: 'text',
                        label: 'First Name',
                        required: true
                    },
                    lastName: {
                        type: 'text',
                        label: 'Last Name',
                        required: true
                    },
                    email: {
                        type: 'email',
                        label: 'Email',
                        required: true
                    },
                    phone: {
                        type: 'tel',
                        label: 'Phone Number',
                        required: false
                    }
                }
            },
            {
                title: 'Professional Details',
                fields: {
                    jobTitle: {
                        type: 'text',
                        label: 'Job Title',
                        required: true
                    },
                    department: {
                        type: 'text',
                        label: 'Department',
                        required: true
                    },
                    startDate: {
                        type: 'date',
                        label: 'Start Date',
                        required: true
                    },
                    salary: {
                        type: 'number',
                        label: 'Salary',
                        required: false
                    }
                }
            }
        ]
    }
};