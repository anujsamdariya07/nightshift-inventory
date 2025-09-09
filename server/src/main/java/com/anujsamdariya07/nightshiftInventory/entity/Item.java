package com.anujsamdariya07.nightshiftInventory.entity;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId id;

    @JsonSerialize(using = ToStringSerializer.class)
    private ObjectId orgId;

    private String name;

    private int quantity;

    @Builder.Default
    private int threshold = 10;

    @Builder.Default
    private Date lastDateOfUpdate = new Date();

    @Builder.Default
    private String image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo6ZeL1Ntu-zwEcgRli39ynixVj9yeQtfjAw&s";

    @Builder.Default
    private ArrayList<UpdateHistory> updateHistory = new ArrayList<>();
}
