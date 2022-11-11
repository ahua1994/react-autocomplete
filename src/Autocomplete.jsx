import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Input, InputGroup, Button } from "reactstrap";
import debounce from "lodash.debounce";
import axios from "axios";
const ITEMS_API_URL = "https://cwbarry.pythonanywhere.com/product/";
const DEBOUNCE_DELAY = 1500;

export default function Autocomplete() {
    const [items, setItems] = useState([]);
    const [fullItems, setFullItems] = useState([]);
    const [query, setQuery] = useState("");

    const debouncedFetch = debounce(() => {
        axios.get(ITEMS_API_URL).then(({ data }) => {
            setItems(data);
            setFullItems(data);
        });
    }, DEBOUNCE_DELAY);

    const debouncedText = debounce(() => {
        const newItems = [...fullItems];
        setItems(
            newItems.filter(x => {
                let words = x.title.toLowerCase().split(" ");
                return words.some(word => word.startsWith(query.toLowerCase()));
            })
        );
    }, DEBOUNCE_DELAY);

    useEffect(() => {
        debouncedFetch();
    }, []);

    useEffect(() => {
        debouncedText();
    }, [query]);

    console.log(items);
    return (
        <div className="container">
            <div className="row justify-content-md-center m-3">
                <h1>Auto Complete</h1>
            </div>
            <div className="row justify-content-md-center m-3">
                <div className="col-4">
                    <h3>{query}</h3>
                    <InputGroup>
                        <Input
                            onChange={e => {
                                setQuery(e.target.value);
                            }}
                            type="text"
                            className="input"
                            value={query}
                        />
                        <Button
                            onClick={() => {
                                setQuery("");
                                debouncedFetch();
                            }}
                            color="danger"
                        >
                            Clear!
                        </Button>
                    </InputGroup>
                </div>
            </div>
            <div className="row justify-content-md-center">
                <div className="col-4">
                    <ListGroup>
                        {items?.map((item, i) => (
                            <ListGroupItem key={i}>{item.title}</ListGroupItem>
                        ))}
                    </ListGroup>
                </div>
            </div>
        </div>
    );
}
