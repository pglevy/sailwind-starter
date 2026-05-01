a!headerContentLayout(
  header: {
    a!cardLayout(
      contents: {
        a!sideBySideLayout(
          items: {
            a!sideBySideItem(
              item: a!imageField(
                labelPosition: "COLLAPSED",
                images: a!webImage(
                  source: "https://images.unsplash.com/photo-1699899657680-421c2c2d5064?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                ),
                size: "MEDIUM_PLUS",
                style: "AVATAR"
              ),
              width: "MINIMIZE"
            ),
            a!sideBySideItem(
              item: {
                a!headingField(
                  text: "Good afternoon, Brittany!",
                  headingTag: "H1",
                  marginBelow: "EVEN_LESS",
                  fontWeight: "REGULAR"
                ),
                a!sideBySideLayout(
                  items: {
                    a!sideBySideItem(
                      item: a!richTextDisplayField(
                        labelPosition: "COLLAPSED",
                        value: {
                          a!richTextIcon(icon: "venus"),
                          " ",
                          a!richTextItem(text: "Female")
                        }
                      ),
                      width: "MINIMIZE"
                    ),
                    a!sideBySideItem(
                      item: a!richTextDisplayField(
                        labelPosition: "COLLAPSED",
                        value: "•"
                      ),
                      width: "MINIMIZE"
                    ),
                    a!sideBySideItem(
                      item: a!richTextDisplayField(
                        labelPosition: "COLLAPSED",
                        value: {
                          a!richTextIcon(icon: "birthday-cake"),
                          " ",
                          a!richTextItem(text: "25 years old")
                        }
                      ),
                      width: "MINIMIZE"
                    )
                  },
                  alignVertical: "MIDDLE"
                )
              },
              width: "MINIMIZE"
            ),
            a!sideBySideItem(
              /*Use a large call to action style record action */
              item: a!buttonArrayLayout(
                buttons: {
                  a!buttonWidget(
                    label: "Request Appointment",
                    size: "LARGE",
                    color: "#C22966",
                    icon: "calendar",
                    style: "SOLID"
                  )
                },
                marginBelow: "NONE"
              )
            )
          },
          alignVertical: "MIDDLE",
          spacing: "SPARSE"
        )
      },
      marginBelow: "NONE",
      height: "AUTO",
      style: "#0E3842",
      showBorder: false,
      padding: "STANDARD"
    )
  },
  contents: {
    a!paneLayout(
      showPaneDividers: false,
      panes: {
        a!pane(
          backgroundColor: "#F0F6F7",
          width: "NARROW_PLUS",
          contents: {
            a!headingField(
              text: "Upcoming Appointments",
              headingTag: "H2",
              size: "MEDIUM",
              fontWeight: "SEMI_BOLD"
            ),
            a!localVariables(
              local!appointments: {
                a!map(
                  appointment: "Well Woman Exam",
                  provider: "Dr. Sandra Jayson, M.D.",
                  date: "Monday, December 22, 2025 at 2:40 PM",
                  address1: "1301 Medical Pl",
                  address2: "Suite 200",
                  address3: "Tysons, VA 22102",
                  practice: "Virginia Women's Care",
                  icon: "female",

                ),
                a!map(
                  appointment: "Annual Physical",
                  provider: "Madison Smith, PA-C",
                  date: "Monday, January 19, 2026 at 8:15 AM",
                  address1: "904 Healing Way",
                  address2: "",
                  address3: "Tysons, VA 22102",
                  practice: "Sterling Family Health",
                  icon: "stethoscope"
                ),
                a!map(
                  appointment: "Total Body Skin Examination",
                  provider: "Dr. Sarah Chen, M.D.",
                  date: "Friday, February 13, 2026 at 3:00 PM",
                  address1: "1973 Wellness Blvd",
                  address2: "",
                  address3: "Tysons, VA 22102",
                  practice: "Dermatology Partners",
                  icon: "hospital-alt"
                )
              },
              {
                a!forEach(
                  items: local!appointments,
                  expression: a!cardLayout(
                    shape: "SEMI_ROUNDED",
                    borderColor: "#DCE6E8",
                    marginBelow: "STANDARD",
                    padding: "STANDARD",
                    contents: {
                      a!headingField(
                        headingTag: "H3",
                        size: "EXTRA_SMALL",
                        fontWeight: "SEMI_BOLD",
                        text: fv!item.appointment,
                        marginBelow: "NONE"
                      ),
                      a!richTextDisplayField(
                        marginBelow: "EVEN_LESS",
                        labelPosition: "COLLAPSED",
                        value: a!richTextItem(text: fv!item.date, size: "SMALL")
                      ),
                      a!richTextDisplayField(
                        marginAbove: "EVEN_LESS",
                        marginBelow: "EVEN_LESS",
                        labelPosition: "COLLAPSED",
                        value: {
                          a!richTextIcon(icon: "user-md", color: "#6b6b6b"),
                          " ",
                          a!richTextItem(
                            text: fv!item.provider,
                            color: "#6b6b6b",
                            size: "SMALL"
                          )
                        }
                      ),
                      a!sideBySideLayout(
                        marginAbove: "NONE",
                        spacing: "DENSE",
                        alignVertical: "TOP",
                        items: {
                          a!sideBySideItem(
                            width: "MINIMIZE",
                            item: a!richTextDisplayField(
                              labelPosition: "COLLAPSED",
                              value: a!richTextIcon(icon: "building", color: "#6b6b6b"),

                            )
                          ),
                          a!sideBySideItem(
                            item: {
                              a!richTextDisplayField(
                                labelPosition: "COLLAPSED",
                                value: {
                                  a!richTextItem(
                                    text: fv!item.address1 & if(
                                      a!isNullOrEmpty(fv!item.address2),
                                      {},
                                      { ", " & fv!item.address2 }
                                    ),
                                    color: "#6b6b6b",
                                    size: "SMALL"
                                  ),
                                  char(10),
                                  a!richTextItem(
                                    text: fv!item.address3,
                                    color: "#6b6b6b",
                                    size: "SMALL"
                                  )
                                }
                              )
                            }
                          )
                        }
                      )
                    }
                  )
                ),
                /*Swap out the button for an action to a record dashboard or another page to view all appointments in a list format*/
                a!buttonArrayLayout(
                  align: "CENTER",
                  buttons: {
                    a!buttonWidget(label: "View All Appointments")
                  }
                )
              }
            ),
          }
        ),
        a!pane(
          contents: {
            a!headingField(
              text: "My Health",
              headingTag: "H2",
              size: "MEDIUM",
              color: "STANDARD",
              fontWeight: "SEMI_BOLD"
            ),
            a!cardLayout(
              contents: {
                a!tabLayout(
                  tabs: {
                    a!tabItem(
                      label: "Health Summary",
                      contents: {
                        a!cardGroupLayout(
                          labelPosition: "COLLAPSED",
                          cards: a!localVariables(
                            local!healthSummaryData: {
                              a!map(
                                icon: "dna",
                                label: "Conditions/Diagnoses",
                                secondaryText: "Generalized Anxiety Disorder (GAD), Vitamin D Deficiency"
                              ),
                              a!map(
                                icon: "viruses",
                                label: "Allergies",
                                secondaryText: "Penicillin (Hives/Anaphylaxis)"
                              ),
                              a!map(
                                icon: "prescription",
                                label: "Medications",
                                secondaryText: "Fluoxetine 20 mg; Norethindrone/Ethinyl Estradiol"
                              ),
                              a!map(
                                icon: "syringe",
                                label: "Immunizations",
                                secondaryText: "COVID-19, HPV (Gardasil 9), Tdap"
                              ),
                              a!map(
                                icon: "user-md",
                                label: "Procedures and Surgeries",
                                secondaryText: "Wisdom Teeth Extraction, Tonsillectomy"
                              ),
                              a!map(
                                icon: "glass-cheers",
                                label: "Lifestyle",
                                secondaryText: "Tobacco: Never Smoker; Alcohol: Socially"
                              ),
                              a!map(
                                icon: "vial",
                                label: "Lab Results",
                                secondaryText: "No results to review"
                              ),

                            },
                            a!forEach(
                              items: local!healthSummaryData,
                              expression: a!cardLayout(
                                contents: {
                                  a!sideBySideLayout(
                                    items: {
                                      a!sideBySideItem(
                                        item: a!sideBySideLayout(
                                          items: {
                                            a!sideBySideItem(
                                              item: a!richTextDisplayField(
                                                labelPosition: "COLLAPSED",
                                                value: a!richTextIcon(
                                                  icon: fv!item.icon,
                                                  size: "MEDIUM_PLUS",
                                                  color: "#C22966"
                                                ),
                                                marginBelow: "NONE"
                                              ),
                                              width: "MINIMIZE"
                                            ),
                                            a!sideBySideItem(
                                              item: {
                                                a!headingField(
                                                  text: fv!item.label,
                                                  headingTag: "H3",
                                                  marginBelow: "EVEN_LESS",
                                                  size: "SMALL",
                                                  fontWeight: "SEMI_BOLD"
                                                ),
                                                a!richTextDisplayField(
                                                  labelPosition: "COLLAPSED",
                                                  value: a!richTextItem(
                                                    text: fv!item.secondaryText,
                                                    color: "SECONDARY"
                                                  ),
                                                  marginBelow: "NONE",
                                                  preventWrapping: true
                                                )
                                              }
                                            )
                                          },
                                          marginBelow: "NONE",
                                          spacing: "SPARSE"
                                        )
                                      ),
                                      a!sideBySideItem(
                                        item: a!richTextDisplayField(
                                          labelPosition: "COLLAPSED",
                                          value: a!richTextIcon(
                                            icon: "angle-right",
                                            size: "MEDIUM_PLUS"
                                          ),
                                          marginBelow: "NONE"
                                        ),
                                        width: "MINIMIZE"
                                      )
                                    },
                                    alignVertical: "MIDDLE"
                                  )
                                },
                                marginBelow: "NONE",
                                borderColor: "#DCE6E8",
                                padding: "STANDARD",
                                shape: "SEMI_ROUNDED",
                                decorativeBarPosition: "START",
                                decorativeBarColor: "#1E798F"
                              )
                            )
                          ),
                          marginAbove: "NONE",
                          marginBelow: "NONE",
                          cardWidth: "NARROW_PLUS"
                        )
                      }
                    ),
                    a!tabItem(label: "Care Summaries"),
                    a!tabItem(label: "Vitals"),
                    a!tabItem(label: "Health Records"),
                    a!tabItem(label: "Tobacco History"),
                    a!tabItem(label: "Forms & Documents")
                  },
                  marginBelow: "NONE",
                  contentsPadding: "MORE"
                )
              },
              borderColor: "#DCE6E8",
              padding: "NONE",
              shape: "SEMI_ROUNDED"
            )
          }
        )
      }
    )
  },
  backgroundColor: "#F0F6F7"
)
