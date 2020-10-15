import React, { Component } from 'react';
import { Container, Card, ButtonGroup, Button, Modal, Form, Col } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

class ProgrammeActuelComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            programmeActuel: '',
            parties: [],
            selectedPartie: '',
            updateModalShow: false,
            index: '',
            reference: '',
            pourcentage: '',
        };

        this.partieChange = this.partieChange.bind(this);
        this.updatePartie = this.updatePartie.bind(this);

    }

    componentDidMount() {
        this.getProgrammeActuel();
        this.getParties();
    }

    getProgrammeActuel() {
        axios.get("http://localhost:8080/programme-actuel")
            .then(response => {
                this.setState({ programmeActuel: response.data });
            });
    }

    getParties() {
        axios.get("http://localhost:8080/parties")
            .then(response => response.data)
            .then((data) => {
                this.setState({ parties: data });
            })
    }

    getSelectedPartie(partieId) {
        axios.get("http://localhost:8080/partie-Id/" + partieId)
            .then(response => response.data)
            .then((data) => {
                this.setState({ selectedPartie: data });
                console.log(this.state.selectedPartie);
            })
    }

    updatePartie(event) {
        event.preventDefault();

        const partie = { reference: this.state.reference, pourcentage: this.state.pourcentage };
        const id = this.state.index;
        console.log(id);
        axios.put("http://localhost:8080/parties/" + id, partie)
            .then(response => {
                if (response.data != null) {
                    this.setState({ updateModalShow: false });

                }
            });
        window.location.reload(false);
    }

    deletePartie(partieId) {
        console.log(partieId);
        axios.delete("http://localhost:8080/parties/" + partieId)
            .then(response => {
                if (response.data != null) {
                    alert("Successfully deleted");
                    this.setState({
                        parties: this.state.parties.filter(partie => partie.id !== partieId)
                    });
                }
            });
    }


    partieChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        let updateModalClose = () => this.setState({ updateModalShow: false });
        const programme = this.state.programmeActuel;
        const tableRows = this.state.parties.map((partie) =>
            <tr key={partie.id}>
                <td>{partie.reference}</td>
                <td>{partie.designation}</td>
                <td>{partie.pourcentage}</td>
                <td>{partie.somme}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" variant="primary btn-group-link"
                            onClick={this.getSelectedPartie.bind(this, partie.id)}>
                            <FontAwesomeIcon icon={faEye} />
                        </Button>

                        <Button className="btn btn-success btn-sm btn-group-link"
                            onClick={() => {
                                this.setState({
                                    updateModalShow: true,
                                    index: parseInt(partie.id),
                                    reference: partie.reference,
                                    pourcentage: partie.pourcentage,
                                })
                            }}>
                            <FontAwesomeIcon icon={faEdit} />
                        </Button>

                        <Button size="sm" variant="danger btn-group-link"
                            onClick={this.deletePartie.bind(this, partie.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>

                    </ButtonGroup>
                </td>

                <Modal
                    show={this.state.updateModalShow}
                    onHide={updateModalClose}
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Modification de la partie
                                </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group as={Col} controlId="formGridReference">
                                <Form.Label>Référence :</Form.Label>
                                <Form.Control required name="reference" type="text" value={this.state.reference}
                                    autoComplete="off" onChange={this.partieChange} placeholder="Saisir la référence" />
                            </Form.Group >
                            <Form.Group as={Col} controlId="formGridPourcentage">
                                <Form.Label>Pourcentage :</Form.Label>
                                <Form.Control required name="pourcentage" type="number" value={this.state.pourcentage}
                                    autoComplete="off" onChange={this.partieChange} placeholder="Saisir le pourcentage" />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.updatePartie}>Confirmer</Button>

                        <Button variant="secondary" onClick={updateModalClose}>Fermer</Button>
                    </Modal.Footer>

                </Modal >


            </tr >
        );
        return (
            <div>
                <Container>
                    <h3>PROGRAMME D'EMPLOI  {programme.annee} </h3>
                    <Card >
                        <Card.Body>
                            <Card.Title>PE FORMATION DES FONCTIONNAIRES ET DES SALARIES EN
                            Master Internet des Objets : Logiciel et Analytique</Card.Title>
                            <Card.Text>
                                <br />
                                <li>  Nombre des  étudiants inscrits : {programme.nombreInscrit} </li>
                                <br />
                                <li>  Coût de la formation Miola : {programme.coutFormation} </li>
                                <br />
                                <li>   Budget total du programme : {programme.budget} </li>
                                <br />
                            </Card.Text>
                            <div className="tableProgramme">
                                <div className="row">
                                    <table className="table table-striped table-bordered table-hover"  >
                                        <thead>
                                            <tr>
                                                <th>Référence</th>
                                                <th>Désignation</th>
                                                <th>Pourcentage</th>
                                                <th>Somme</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableRows}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        );
    }
}

export default ProgrammeActuelComponent;