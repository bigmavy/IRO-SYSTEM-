// IRO Application - Main JavaScript

// Sample data store (replace with Firebase/backend in production)
let issues = JSON.parse(localStorage.getItem('iro_issues')) || [];
let issueCounter = parseInt(localStorage.getItem('iro_counter')) || 1;

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();
    loadRecentIssues();

    // Form submission
    const form = document.getElementById('issueForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitIssue();
        });
    }

    // Severity slider
    const severitySlider = document.getElementById('severity');
    const severityLabel = document.getElementById('severityLabel');
    if (severitySlider && severityLabel) {
        severitySlider.addEventListener('input', function() {
            severityLabel.textContent = this.value;
        });
    }
});

// Submit Issue
function submitIssue() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    const severity = document.getElementById('severity').value;

    if (!fullName || !email || !category || !location || !description) {
        document.getElementById('formFeedback').innerHTML = 
            '<p style="color:red;">Please fill in all required fields.</p>';
        return;
    }

    const issue = {
        id: 'IRO-' + String(issueCounter).padStart(4, '0'),
        fullName,
        email,
        category,
        location,
        description,
        severity: parseInt(severity),
        status: 'Pending',
        date: new Date().toISOString(),
        updates: []
    };

    issues.unshift(issue);
    issueCounter++;
    localStorage.setItem('iro_issues', JSON.stringify(issues));
    localStorage.setItem('iro_counter', String(issueCounter));

    document.getElementById('formFeedback').innerHTML = 
        `<p style="color:green;">✅ Issue submitted! Your tracking ID: <strong>${issue.id}</strong></p>`;
    document.getElementById('issueForm').reset();
    document.getElementById('severityLabel').textContent = '3';

    updateDashboard();
    loadRecentIssues();
}

// Track Issue
function trackIssue() {
    const trackId = document.getElementById('trackId').value.trim();
    const resultDiv = document.getElementById('trackResult');

    if (!trackId) {
        resultDiv.innerHTML = '<p style="color:red;">Please enter an Issue ID.</p>';
        return;
    }

    const issue = issues.find(i => i.id === trackId);
    if (issue) {
        resultDiv.innerHTML = `
            <div style="border:1px solid #ddd;padding:1rem;border-radius:4px;">
                <h3>${issue.id}</h3>
                <p><strong>Category:</strong> ${issue.category}</p>
                <p><strong>Location:</strong> ${issue.location}</p>
                <p><strong>Status:</strong> <span style="color:${getStatusColor(issue.status)};">${issue.status}</span></p>
                <p><strong>Description:</strong> ${issue.description}</p>
                <p><strong>Submitted:</strong> ${new Date(issue.date).toLocaleDateString()}</p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = '<p style="color:red;">Issue not found. Please check the ID.</p>';
    }
}

// Dashboard Updates
function updateDashboard() {
    document.getElementById('totalIssues').textContent = issues.length;
    document.getElementById('resolvedIssues').textContent = issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
    document.getElementById('pendingIssues').textContent = issues.filter(i => i.status === 'Pending' || i.status === 'In Progress').length;
}

function loadRecentIssues() {
    const container = document.getElementById('recentIssues');
    if (!container) return;

    const recent = issues.slice(0, 5);
    if (recent.length === 0) {
        container.innerHTML = '<p>No issues reported yet.</p>';
        return;
    }

    let html = '<h3>Recent Issues</h3><ul style="list-style:none;padding:0;">';
    recent.forEach(issue => {
        html += `
            <li style="padding:0.8rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;">
                <span><strong>${issue.id}</strong> - ${issue.category} (${issue.location})</span>
                <span style="color:${getStatusColor(issue.status)};">${issue.status}</span>
            </li>
        `;
    });
    html += '</ul>';
    container.innerHTML = html;
}

function getStatusColor(status) {
    switch(status) {
        case 'Resolved': return 'green';
        case 'Closed': return '#666';
        case 'In Progress': return 'orange';
        default: return 'red';
    }
}

// Expose functions globally
window.trackIssue = trackIssue;
