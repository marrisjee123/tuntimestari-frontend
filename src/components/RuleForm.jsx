import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    TextField,
    Grid,
    Button,
    Typography,
    Card,
    CardContent,
    MenuItem,
    Alert,
    Select,
    InputLabel,
    FormControl,
    FormHelperText
} from '@mui/material';
import './RuleForm.css';

const RuleForm = () => {
    const [rules, setRules] = useState({
        daily_max_hours: '',
        weekly_max_hours: '',
        break_duration: '',
        daily_rest_time: '',
        weekly_rest_time: '',
        overtime_rates: [{ threshold: '', rate: '' }],
        evening_premium_start: '',
        evening_premium_rate: '',
        night_premium_start: '',
        night_premium_rate: '',
        saturday_premium: '',
        on_call_premium: '',
        emergency_premium: '',
        days_per_week: '',
        week_start_day: ''
    });

    const [validated, setValidated] = useState(false);
    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRules({ ...rules, [name]: value });
    };

    const handleOvertimeChange = (index, e) => {
        const { name, value } = e.target;
        const newOvertimeRates = [...rules.overtime_rates];
        newOvertimeRates[index][name] = value;
        setRules({ ...rules, overtime_rates: newOvertimeRates });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setFormError('Please fill out all required fields.');
        } else {
            axios.post('/api/worksettings/', rules)
                .then(response => {
                    console.log('Rules saved:', response.data);
                    setFormError('');
                    setValidated(false);
                    setRules({
                        daily_max_hours: '',
                        weekly_max_hours: '',
                        break_duration: '',
                        daily_rest_time: '',
                        weekly_rest_time: '',
                        overtime_rates: [{ threshold: '', rate: '' }],
                        evening_premium_start: '',
                        evening_premium_rate: '',
                        night_premium_start: '',
                        night_premium_rate: '',
                        saturday_premium: '',
                        on_call_premium: '',
                        emergency_premium: '',
                        days_per_week: '',
                        week_start_day: ''
                    });
                })
                .catch(error => {
                    console.error('Error saving rules:', error);
                    setFormError('Error saving rules.');
                });
        }
        setValidated(true);
    };

    const addOvertimeRate = () => {
        setRules({ ...rules, overtime_rates: [...rules.overtime_rates, { threshold: '', rate: '' }] });
    };

    const renderTimeInput = (name, label) => (
        <Grid item xs={12} sm={6}>
            <TextField
                label={label}
                type="time"
                name={name}
                value={rules[name]}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
                required
            />
        </Grid>
    );

    return (
        <Container maxWidth="md">
            <Card className="mt-4">
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Work Settings Form
                    </Typography>
                    {formError && <Alert severity="error">{formError}</Alert>}
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Daily Max Hours"
                                    type="number"
                                    name="daily_max_hours"
                                    value={rules.daily_max_hours}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g., 8"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Weekly Max Hours"
                                    type="number"
                                    name="weekly_max_hours"
                                    value={rules.weekly_max_hours}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g., 40"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Break Duration (minutes)"
                                    type="number"
                                    name="break_duration"
                                    value={rules.break_duration}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g., 30"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Daily Rest Time (hours)"
                                    type="number"
                                    name="daily_rest_time"
                                    value={rules.daily_rest_time}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g., 11"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Weekly Rest Time (hours)"
                                    type="number"
                                    name="weekly_rest_time"
                                    value={rules.weekly_rest_time}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g., 35"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Overtime Rates
                                </Typography>
                                {rules.overtime_rates.map((rate, index) => (
                                    <Grid container spacing={3} key={index} className="mb-2">
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Threshold (hours)"
                                                type="number"
                                                name="threshold"
                                                value={rate.threshold}
                                                onChange={(e) => handleOvertimeChange(index, e)}
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Rate (multiplier)"
                                                type="number"
                                                step="0.01"
                                                name="rate"
                                                value={rate.rate}
                                                onChange={(e) => handleOvertimeChange(index, e)}
                                                fullWidth
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                ))}
                                <Button variant="outlined" onClick={addOvertimeRate}>Add Overtime Rate</Button>
                            </Grid>
                            {renderTimeInput('evening_premium_start', 'Evening Premium Start (HH:mm)')}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Evening Premium Rate (multiplier)"
                                    type="number"
                                    step="0.01"
                                    name="evening_premium_rate"
                                    value={rules.evening_premium_rate}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g., 1.5"
                                />
                            </Grid>
                            {renderTimeInput('night_premium_start', 'Night Premium Start (HH:mm)')}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Night Premium Rate (multiplier)"
                                    type="number"
                                    step="0.01"
                                    name="night_premium_rate"
                                    value={rules.night_premium_rate}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g., 2.0"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Saturday Premium (multiplier)"
                                    type="number"
                                    step="0.01"
                                    name="saturday_premium"
                                    value={rules.saturday_premium}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g., 1.5"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="On-call Premium (multiplier)"
                                    type="number"
                                    step="0.01"
                                    name="on_call_premium"
                                    value={rules.on_call_premium}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g., 1.25"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Emergency Premium (multiplier)"
                                    type="number"
                                    step="0.01"
                                    name="emergency_premium"
                                    value={rules.emergency_premium}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g., 2.0"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Days per Week"
                                    type="number"
                                    name="days_per_week"
                                    value={rules.days_per_week}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    placeholder="e.g., 5"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Week Start Day</InputLabel>
                                    <Select
                                        name="week_start_day"
                                        value={rules.week_start_day}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="0">Monday</MenuItem>
                                        <MenuItem value="1">Tuesday</MenuItem>
                                        <MenuItem value="2">Wednesday</MenuItem>
                                        <MenuItem value="3">Thursday</MenuItem>
                                        <MenuItem value="4">Friday</MenuItem>
                                        <MenuItem value="5">Saturday</MenuItem>
                                        <MenuItem value="6">Sunday</MenuItem>
                                    </Select>
                                    <FormHelperText>Please select a valid start day.</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Save Rules
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default RuleForm;
