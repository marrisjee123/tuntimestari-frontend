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
    FormHelperText,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import './RuleForm.css';

const InfoButton = ({ title, content }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton onClick={handleClickOpen} style={{ float: 'right' }}>
                <InfoIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Sulje
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const RuleForm = () => {
    const [rules, setRules] = useState({
        model_name: '',
        version: '',
        employees: '',
        collective_agreement: '',
        week_start_day: '',
        daily_max_hours: '',
        weekly_max_hours: '',
        break_duration: '',
        daily_rest_time: '',
        weekly_rest_time: '',
        overtime_rules: [
            {
                name: 'Päivittäinen ylityö',
                type: 'multiplier',
                threshold: '',
                rate: { euros: '', cents: '' }
            },
            {
                name: 'Viikoittainen ylityö',
                type: 'multiplier',
                threshold: '',
                rate: { euros: '', cents: '' }
            }
        ],
        other_compensations: {
            evening_premium_start: '',
            evening_premium_type: 'multiplier',
            evening_premium_rate: { euros: '', cents: '' },
            night_premium_start: '',
            night_premium_type: 'multiplier',
            night_premium_rate: { euros: '', cents: '' },
            saturday_premium_type: 'multiplier',
            saturday_premium: { euros: '', cents: '' },
            on_call_premium_type: 'multiplier',
            on_call_premium: { euros: '', cents: '' },
            emergency_premium_type: 'multiplier',
            emergency_premium: { euros: '', cents: '' }
        },
        days_per_week: '',
        is_bank_used: false
    });

    const [validated, setValidated] = useState(false);
    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setRules({ ...rules, [name]: checked });
        } else {
            setRules({ ...rules, [name]: value });
        }
    };

    const handleOvertimeChange = (index, e) => {
        const { name, value } = e.target;
        const newOvertimeRules = [...rules.overtime_rules];
        if (name === 'rate_euros' || name === 'rate_cents') {
            newOvertimeRules[index].rate[name.split('_')[1]] = value;
        } else {
            newOvertimeRules[index][name] = value;
        }
        setRules({ ...rules, overtime_rules: newOvertimeRules });
    };

    const handleOtherCompensationsChange = (compName, e) => {
        const { name, value } = e.target;
        const newCompensations = { ...rules.other_compensations };
        if (name === 'rate_euros' || name === 'rate_cents') {
            newCompensations[compName].rate[name.split('_')[1]] = value;
        } else {
            newCompensations[compName][name] = value;
        }
        setRules({ ...rules, other_compensations: newCompensations });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setFormError('Täytä kaikki vaaditut kentät.');
        } else {
            axios.post('/api/worksettings/', rules)
                .then(response => {
                    console.log('Säännöt tallennettu:', response.data);
                    setFormError('');
                    setValidated(false);
                    setRules({
                        model_name: '',
                        version: '',
                        employees: '',
                        collective_agreement: '',
                        week_start_day: '',
                        daily_max_hours: '',
                        weekly_max_hours: '',
                        break_duration: '',
                        daily_rest_time: '',
                        weekly_rest_time: '',
                        overtime_rules: [
                            {
                                name: 'Päivittäinen ylityö',
                                type: 'multiplier',
                                threshold: '',
                                rate: { euros: '', cents: '' }
                            },
                            {
                                name: 'Viikoittainen ylityö',
                                type: 'multiplier',
                                threshold: '',
                                rate: { euros: '', cents: '' }
                            }
                        ],
                        other_compensations: {
                            evening_premium_start: '',
                            evening_premium_type: 'multiplier',
                            evening_premium_rate: { euros: '', cents: '' },
                            night_premium_start: '',
                            night_premium_type: 'multiplier',
                            night_premium_rate: { euros: '', cents: '' },
                            saturday_premium_type: 'multiplier',
                            saturday_premium: { euros: '', cents: '' },
                            on_call_premium_type: 'multiplier',
                            on_call_premium: { euros: '', cents: '' },
                            emergency_premium_type: 'multiplier',
                            emergency_premium: { euros: '', cents: '' }
                        },
                        days_per_week: '',
                        is_bank_used: false
                    });
                })
                .catch(error => {
                    console.error('Virhe tallennettaessa sääntöjä:', error);
                    setFormError('Virhe tallennettaessa sääntöjä.');
                });
        }
        setValidated(true);
    };

    const addOvertimeRule = () => {
        setRules({ ...rules, overtime_rules: [...rules.overtime_rules, { name: '', type: 'multiplier', threshold: '', rate: { euros: '', cents: '' } }] });
    };

    const renderTextField = (name, label) => (
        <Grid item xs={12} sm={6} style={{ marginBottom: '20px', position: 'relative' }}>
            <Typography variant="h6" gutterBottom>
                {label}
                <InfoButton title={label} content="Tähän tulee ohjeet." />
            </Typography>
            <TextField
                label={label}
                name={name}
                value={rules[name]}
                onChange={handleChange}
                fullWidth
                required
            />
        </Grid>
    );

    const renderNumberField = (name, label, placeholder) => (
        <Grid item xs={12} sm={6} style={{ marginBottom: '20px', position: 'relative' }}>
            <Typography variant="h6" gutterBottom>
                {label}
                <InfoButton title={label} content="Tähän tulee ohjeet." />
            </Typography>
            <TextField
                label={label}
                type="number"
                name={name}
                value={rules[name]}
                onChange={handleChange}
                fullWidth
                required
                placeholder={placeholder}
            />
        </Grid>
    );

    const renderTimeField = (name, label) => (
        <Grid item xs={12} sm={6} style={{ marginBottom: '20px', position: 'relative' }}>
            <Typography variant="h6" gutterBottom>
                {label}
                <InfoButton title={label} content="Tähän tulee ohjeet." />
            </Typography>
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

    const renderRateInput = (index, rate) => (
        <Grid container spacing={3} key={index} style={{ marginBottom: '20px', position: 'relative' }}>
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                    Ylityökorvauksen nimi
                    <InfoButton title="Ylityökorvauksen nimi" content="Tähän tulee ohjeet." />
                </Typography>
                <TextField
                    label="Nimi"
                    name="name"
                    value={rate.name}
                    onChange={(e) => handleOvertimeChange(index, e)}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                    Kynnys (tunnit)
                    <InfoButton title="Kynnys (tunnit)" content="Tähän tulee ohjeet." />
                </Typography>
                <TextField
                    label="Kynnys (tunnit)"
                    type="number"
                    name="threshold"
                    value={rate.threshold}
                    onChange={(e) => handleOvertimeChange(index, e)}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                    Ylityökorvaus (euroa)
                    <InfoButton title="Ylityökorvaus (euroa)" content="Tähän tulee ohjeet." />
                </Typography>
                <TextField
                    label="Ylityökorvaus (euroa)"
                    type="number"
                    name="rate_euros"
                    value={rate.rate.euros}
                    onChange={(e) => handleOvertimeChange(index, e)}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                    Ylityökorvaus (senttiä)
                    <InfoButton title="Ylityökorvaus (senttiä)" content="Tähän tulee ohjeet." />
                </Typography>
                <TextField
                    label="Ylityökorvaus (senttiä)"
                    type="number"
                    name="rate_cents"
                    value={rate.rate.cents}
                    onChange={(e) => handleOvertimeChange(index, e)}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={12} sm={12}>
                <Typography variant="h6" gutterBottom>
                    Korvaustyyppi
                    <InfoButton title="Korvaustyyppi" content="Tähän tulee ohjeet." />
                </Typography>
                <RadioGroup
                    name="type"
                    value={rate.type}
                    onChange={(e) => handleOvertimeChange(index, e)}
                    row
                >
                    <FormControlLabel value="multiplier" control={<Radio />} label="Kerroin" />
                    <FormControlLabel value="fixed" control={<Radio />} label="Kiinteä" />
                </RadioGroup>
            </Grid>
        </Grid>
    );

    const renderPremiumInput = (name, label) => (
        <Grid item xs={12} sm={6} style={{ marginBottom: '20px', position: 'relative' }}>
            <Typography variant="h6" gutterBottom>
                {label}
                <InfoButton title={label} content="Valitse, onko kyseessä kerroin vai kiinteä lisä." />
            </Typography>
            <FormControl component="fieldset" fullWidth>
                <RadioGroup
                    row
                    name={`${name}_type`}
                    value={rules.other_compensations[`${name}_type`]}
                    onChange={(e) => handleOtherCompensationsChange(name, e)}
                >
                    <FormControlLabel value="multiplier" control={<Radio />} label="Kerroin" />
                    <FormControlLabel value="fixed" control={<Radio />} label="Kiinteä lisä e/h" />
                </RadioGroup>
            </FormControl>
            {rules.other_compensations[`${name}_type`] === 'fixed' ? (
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom>
                            Kiinteä lisä (euroa)
                            <InfoButton title="Kiinteä lisä (euroa)" content="Tähän tulee ohjeet." />
                        </Typography>
                        <TextField
                            label="Kiinteä lisä (euroa)"
                            type="number"
                            name="rate_euros"
                            value={rules.other_compensations[`${name}_rate`].euros}
                            onChange={(e) => handleOtherCompensationsChange(name, e)}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6" gutterBottom>
                            Kiinteä lisä (senttiä)
                            <InfoButton title="Kiinteä lisä (senttiä)" content="Tähän tulee ohjeet." />
                        </Typography>
                        <TextField
                            label="Kiinteä lisä (senttiä)"
                            type="number"
                            name="rate_cents"
                            value={rules.other_compensations[`${name}_rate`].cents}
                            onChange={(e) => handleOtherCompensationsChange(name, e)}
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
            ) : (
                <TextField
                    label="Kerroin"
                    type="number"
                    step="0.01"
                    name={`${name}_rate`}
                    value={rules.other_compensations[`${name}_rate`]}
                    onChange={(e) => handleOtherCompensationsChange(name, e)}
                    fullWidth
                    required
                    placeholder="esim. 1.5"
                />
            )}
        </Grid>
    );

    return (
        <Container maxWidth="md">
            <Card className="mt-4">
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Työasetukset
                    </Typography>
                    {formError && <Alert severity="error">{formError}</Alert>}
                    <form noValidate onSubmit={handleSubmit}>
                        <Typography variant="h5" gutterBottom>
                            Mallin tiedot
                            <InfoButton title="Mallin tiedot" content="Tähän tulee ohjeet." />
                        </Typography>
                        <Grid container spacing={3} style={{ marginBottom: '20px', position: 'relative' }}>
                            {renderTextField('model_name', 'Työaikamallin nimi')}
                            {renderTextField('version', 'Versio')}
                        </Grid>
                        
                        <Typography variant="h5" gutterBottom>
                            Työaika
                            <InfoButton title="Työaika" content="Tähän tulee ohjeet." />
                        </Typography>
                        <Grid container spacing={3} style={{ marginBottom: '20px', position: 'relative' }}>
                            {renderTextField('employees', 'Ketä työntekijöitä koskee')}
                            {renderTextField('collective_agreement', 'Noudatettava työehtosopimus')}
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Viikon alkamispäivä
                                    <InfoButton title="Viikon alkamispäivä" content="Tähän tulee ohjeet." />
                                </Typography>
                                <FormControl fullWidth required>
                                    <InputLabel>Viikon alkamispäivä</InputLabel>
                                    <Select
                                        name="week_start_day"
                                        value={rules.week_start_day}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="0">Maanantai</MenuItem>
                                        <MenuItem value="1">Tiistai</MenuItem>
                                        <MenuItem value="2">Keskiviikko</MenuItem>
                                        <MenuItem value="3">Torstai</MenuItem>
                                        <MenuItem value="4">Perjantai</MenuItem>
                                        <MenuItem value="5">Lauantai</MenuItem>
                                        <MenuItem value="6">Sunnuntai</MenuItem>
                                    </Select>
                                    <FormHelperText>Valitse viikon alkamispäivä</FormHelperText>
                                </FormControl>
                            </Grid>
                            {renderNumberField('daily_max_hours', 'Päivittäinen maksimityöaika (tunnit)', 'esim. 8')}
                            {renderNumberField('weekly_max_hours', 'Viikoittainen maksimityöaika (tunnit)', 'esim. 40')}
                            {renderNumberField('break_duration', 'Tauon kesto (minuutit)', 'esim. 30')}
                            {renderNumberField('daily_rest_time', 'Päivittäinen lepoaika (tunnit)', 'esim. 11')}
                            {renderNumberField('weekly_rest_time', 'Viikoittainen lepoaika (tunnit)', 'esim. 35')}
                            {renderNumberField('days_per_week', 'Työpäivien määrä viikossa', 'esim. 5')}
                        </Grid>

                        <Typography variant="h5" gutterBottom>
                            Ylityöt
                            <InfoButton title="Ylityöt" content="Tähän tulee ohjeet." />
                        </Typography>
                        <Grid container spacing={0} style={{ marginBottom: '20px', position: 'relative' }}>
                            {rules.overtime_rules.map((rate, index) => renderRateInput(index, rate))}
                            <Grid item xs={12}>
                                <Button variant="outlined" onClick={addOvertimeRule}>Lisää ylityökorvaus</Button>
                            </Grid>
                        </Grid>

                        <Typography variant="h5" gutterBottom>
                            Muut korvaukset
                            <InfoButton title="Muut korvaukset" content="Tähän tulee ohjeet." />
                        </Typography>
                        <Grid container spacing={3} style={{ marginBottom: '20px', position: 'relative' }}>
                            {renderTimeField('evening_premium_start', 'Ilta-ajan korvauksen alkamisaika (HH:mm)')}
                            {renderPremiumInput('evening_premium', 'Ilta-ajan korvaus')}
                            {renderTimeField('night_premium_start', 'Yöajan korvauksen alkamisaika (HH:mm)')}
                            {renderPremiumInput('night_premium', 'Yöajan korvaus')}
                            {renderPremiumInput('saturday_premium', 'Lauantaikorvaus')}
                            {renderPremiumInput('on_call_premium', 'Päivystyskorvaus')}
                            {renderPremiumInput('emergency_premium', 'Hätätapauksen korvaus')}
                        </Grid>

                        <Typography variant="h5" gutterBottom>
                            Pankkikäyttö
                            <InfoButton title="Pankkikäyttö" content="Tähän tulee ohjeet." />
                        </Typography>
                        <Grid container spacing={3} style={{ marginBottom: '20px', position: 'relative' }}>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox checked={rules.is_bank_used} onChange={handleChange} name="is_bank_used" />}
                                    label="Onko työaika pankkikäytössä?"
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Tallenna säännöt
                            </Button>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );
};

export default RuleForm;

