package com.Miola.SpringDataRest.Modele;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@RequiredArgsConstructor
@NoArgsConstructor
public class Professeur {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	@NonNull
	private String NomComplet;
	@NonNull
	private String grade;
	private int nbrHeur;
	@NonNull
	private String type;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "partie")
	@JsonIgnore
	private Partie partie;

	public double getBrute() {
		return 300 * this.nbrHeur;
	}

	public double getNet() {
		double igr = 0.38;
		if (this.type.equals("Externe"))
			igr = 0.17;
		return Math.ceil(this.getBrute() / (1 - igr));
	}

	public int getJours() {
		int tarif;
		if (this.grade.equals("PA"))
			tarif = 1000;
		else {
			if (this.grade.equals("PH"))
				tarif = 1250;
			else
				tarif = 1500;
		}
		return (int) Math.ceil(this.getBrute() / tarif);
	}
}
