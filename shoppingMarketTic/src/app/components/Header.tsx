import { ChangeEvent, useRef, useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { debounce } from "lodash";
import { ProductProps } from "../interfaces/Product";
import { useQuery } from "react-query";
import { useOnClickOutside } from "../hooks/useClickOutside";
import { Link } from "react-router-dom";
import Input from "./Input";
import List from "./List";
import ProductService from "../services/product.service";
import { useShoppingList } from "../contexts/ShoppingCart";


const Header = () => {
	const [productName, setproductName] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const refDropdown = useRef<HTMLUListElement>(null);

	const { totalQtd } = useShoppingList(); 

	const {
		data: productsByName,
		/*isLoading,
		error,*/
	} = useQuery<ProductProps[], Error>(
		["query-products-by-name", productName],
		async () => {
			return ProductService.searchName(productName);
		},
		{
			enabled: productName.length > 0,
			onSuccess: (res) => {
				setIsOpen(res?.length > 0);
			},
		},
	);

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setproductName(value);
	};

	useOnClickOutside(refDropdown, () => {
		setIsOpen(false);
	});

	const debounceOnChange = debounce(handleInput, 500);

	return (
		<header className="fixed right-0 top-0 flex w-full justify-center bg-white py-3">
			<div className="mx-auto flex w-11/12 items-center justify-between gap-52">
				<div>
					<Link to="/" relative="path">
						<img
							src="./assets/logo.png"
							alt="Company Logo"
							className="max-w-36"
						/>
					</Link>
				</div>
				<div className="relative w-4/5">
					<Input onChange={debounceOnChange} />
					{isOpen && (
						<ul
							ref={refDropdown}
							className="absolute z-50 mt-4 max-h-60 w-full overflow-auto rounded-md bg-white p-4 shadow-lg"
						>
							{productsByName?.map((product: ProductProps) => {
								return (
									<List className="items-center justify-between">
										{product.name}
										<div>
											<img
												className="h-20 rounded-t-lg object-cover"
												src={`./assets/produtos/${product.image}.jpg`}
											/>

											<span>R$ {product.price}</span>
										</div>
									</List>
								);
							})}
						</ul>
					)}
				</div>
				<Link className="flex" to="/shopping-cart" relative="path">
					<CiShoppingCart className="h-12 w-20" />

					{totalQtd > 0 && (
						<div className="relative right-8 flex size-6 justify-center rounded-3xl bg-blue-500">
							<span>{totalQtd}</span>
						</div>
					)}
				</Link>
			</div>
		</header>
	);
};

export default Header;
